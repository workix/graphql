import tls from 'tls';
import { CertificateMonitorService, certificateMonitorService } from '../../src/utils/certificate_monitor.service';

describe('CertificateMonitorService', () => {
  it('deve ser um singleton', () => {
    const instance1 = CertificateMonitorService.getInstance();
    const instance2 = certificateMonitorService;
    expect(instance1).toBe(instance2);
  });

  it('deve classificar certificado com mais de 30 dias como VALID', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);

    const cert = certificateMonitorService.evaluateCertificate(futureDate, 'app.workix.com', "Let's Encrypt");
    expect(cert.status).toBe('VALID');
    expect(cert.isExpiringSoon).toBe(false);
    expect(cert.daysRemaining).toBeGreaterThanOrEqual(59);
    expect(cert.hostname).toBe('app.workix.com');
  });

  it('deve classificar certificado entre 8 e 30 dias como WARNING', () => {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + 20);

    const cert = certificateMonitorService.evaluateCertificate(warningDate, 'tenant1.workix.com', 'DigiCert');
    expect(cert.status).toBe('WARNING');
    expect(cert.isExpiringSoon).toBe(true);
    expect(cert.daysRemaining).toBeGreaterThanOrEqual(19);
  });

  it('deve classificar certificado com 7 dias ou menos como CRITICAL', () => {
    const criticalDate = new Date();
    criticalDate.setDate(criticalDate.getDate() + 5);

    const cert = certificateMonitorService.evaluateCertificate(criticalDate, 'tenant2.workix.com', "Let's Encrypt");
    expect(cert.status).toBe('CRITICAL');
    expect(cert.isExpiringSoon).toBe(true);
    expect(cert.daysRemaining).toBeLessThanOrEqual(7);
  });

  it('deve classificar certificado expirado como EXPIRED', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 2);

    const cert = certificateMonitorService.evaluateCertificate(pastDate, 'expired.workix.com', 'Sectigo');
    expect(cert.status).toBe('EXPIRED');
    expect(cert.isExpiringSoon).toBe(true);
    expect(cert.daysRemaining).toBeLessThan(0);
  });

  it('deve consultar certificado remoto mockado com sucesso', async () => {
    const mockDate = new Date();
    mockDate.setDate(mockDate.getDate() + 45);

    const fakeSocket: any = {
      getPeerCertificate: jest.fn().mockReturnValue({
        valid_to: mockDate.toISOString(),
        issuer: { O: 'Workix CA', CN: 'Workix Root' }
      }),
      end: jest.fn(),
      setTimeout: jest.fn(),
      on: jest.fn(),
      destroy: jest.fn()
    };

    const spyTls = jest.spyOn(tls, 'connect').mockImplementation((options: any, callback: any) => {
      process.nextTick(() => {
        if (typeof callback === 'function') {
          callback();
        }
      });
      return fakeSocket;
    });

    const certInfo = await certificateMonitorService.checkRemoteCertificate('whitelabel.empresa.com.br');
    expect(certInfo.hostname).toBe('whitelabel.empresa.com.br');
    expect(certInfo.status).toBe('VALID');
    expect(certInfo.issuer).toBe('Workix CA');

    spyTls.mockRestore();
  });
});
