import tls from 'tls';
import { logger } from './logger';

export type CertificateStatus = 'VALID' | 'WARNING' | 'CRITICAL' | 'EXPIRED';

export interface CertificateInfo {
  hostname: string;
  issuer?: string;
  validFrom?: string;
  validTo: string;
  daysRemaining: number;
  status: CertificateStatus;
  isExpiringSoon: boolean;
  checkedAt: string;
}

export class CertificateMonitorService {
  private static instance: CertificateMonitorService;

  public static getInstance(): CertificateMonitorService {
    if (!CertificateMonitorService.instance) {
      CertificateMonitorService.instance = new CertificateMonitorService();
    }
    return CertificateMonitorService.instance;
  }

  /**
   * Avalia a validade de um certificado com base na data de expiração (validTo).
   */
  public evaluateCertificate(validToDate: Date | string, hostname: string, issuer?: string): CertificateInfo {
    const now = new Date();
    const expiryDate = typeof validToDate === 'string' ? new Date(validToDate) : validToDate;
    const diffMs = expiryDate.getTime() - now.getTime();
    const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let status: CertificateStatus;
    if (daysRemaining < 0) {
      status = 'EXPIRED';
    } else if (daysRemaining <= 7) {
      status = 'CRITICAL';
    } else if (daysRemaining <= 30) {
      status = 'WARNING';
    } else {
      status = 'VALID';
    }

    const info: CertificateInfo = {
      hostname,
      issuer,
      validTo: expiryDate.toISOString(),
      daysRemaining,
      status,
      isExpiringSoon: daysRemaining <= 30,
      checkedAt: now.toISOString()
    };

    if (status === 'CRITICAL' || status === 'EXPIRED') {
      logger.error(`Certificado SSL/TLS crítico para o domínio ${hostname}: expira em ${daysRemaining} dias`, {
        operation: 'SSL_MONITOR',
        context: { hostname, daysRemaining, status }
      });
    } else if (status === 'WARNING') {
      logger.warn(`Alerta de expiração de certificado SSL/TLS para ${hostname}: expira em ${daysRemaining} dias`, {
        operation: 'SSL_MONITOR',
        context: { hostname, daysRemaining, status }
      });
    }

    return info;
  }

  /**
   * Conecta a um servidor remoto via TLS para inspecionar o certificado SSL em tempo real.
   */
  public async checkRemoteCertificate(hostname: string, port: number = 443, timeoutMs: number = 5000): Promise<CertificateInfo> {
    return new Promise((resolve, reject) => {
      const socket = tls.connect(
        {
          host: hostname,
          port: port,
          servername: hostname,
          rejectUnauthorized: false
        },
        () => {
          const peerCertificate = socket.getPeerCertificate();
          socket.end();

          if (!peerCertificate || !peerCertificate.valid_to) {
            return reject(new Error(`Não foi possível recuperar o certificado TLS do host ${hostname}`));
          }

          const issuerStr = typeof peerCertificate.issuer === 'object' 
            ? (peerCertificate.issuer.O || peerCertificate.issuer.CN || JSON.stringify(peerCertificate.issuer))
            : String(peerCertificate.issuer);

          const result = this.evaluateCertificate(peerCertificate.valid_to, hostname, issuerStr);
          resolve(result);
        }
      );

      socket.setTimeout(timeoutMs, () => {
        socket.destroy();
        reject(new Error(`Timeout ao conectar via TLS no host ${hostname}:${port}`));
      });

      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });
    });
  }

  /**
   * Verifica uma lista de múltiplos domínios (ex: tenants White Label).
   */
  public async checkMultipleDomains(domains: string[]): Promise<CertificateInfo[]> {
    const results: CertificateInfo[] = [];
    for (const domain of domains) {
      try {
        const certInfo = await this.checkRemoteCertificate(domain);
        results.push(certInfo);
      } catch (err: any) {
        logger.error(`Falha ao verificar certificado SSL do domínio ${domain}: ${err?.message}`, {
          operation: 'SSL_MONITOR_ERROR',
          context: { domain, error: err?.message }
        });
      }
    }
    return results;
  }
}

export const certificateMonitorService = CertificateMonitorService.getInstance();
