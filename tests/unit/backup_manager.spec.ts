import fs from 'fs';
import path from 'path';
import { BackupManagerService, backupManagerService } from '../../src/utils/backup_manager.service';

describe('BackupManagerService & Disaster Recovery', () => {
  const testBackupsDir = path.join(__dirname, '../../test-backups-temp');

  afterAll(() => {
    if (fs.existsSync(testBackupsDir)) {
      fs.rmSync(testBackupsDir, { recursive: true, force: true });
    }
  });

  it('deve ser um singleton', () => {
    const instance1 = BackupManagerService.getInstance();
    const instance2 = backupManagerService;
    expect(instance1).toBe(instance2);
  });

  it('deve criar um snapshot com metadados, checksum SHA-256 e status compliant', async () => {
    const snapshot = await backupManagerService.createSnapshot(testBackupsDir);

    expect(snapshot).toBeDefined();
    expect(snapshot.id).toMatch(/^backup_/);
    expect(snapshot.checksumSha256).toHaveLength(64); // SHA-256 hex string
    expect(snapshot.sizeBytes).toBeGreaterThan(0);
    expect(fs.existsSync(snapshot.filepath)).toBe(true);

    const drStatus = backupManagerService.getDisasterRecoveryStatus();
    expect(drStatus.rpoTargetMinutes).toBe(15);
    expect(drStatus.rtoTargetHours).toBe(1);
    expect(drStatus.status).toBe('COMPLIANT');
    expect(drStatus.lastBackup?.id).toBe(snapshot.id);
  });

  it('deve verificar integridade criptográfica corretamente', async () => {
    const snapshot = await backupManagerService.createSnapshot(testBackupsDir);
    const isValid = backupManagerService.verifyIntegrity(snapshot.filepath, snapshot.checksumSha256);
    expect(isValid).toBe(true);

    const isInvalid = backupManagerService.verifyIntegrity(snapshot.filepath, 'invalidchecksum00000000000000000000000000000000000000000000000000');
    expect(isInvalid).toBe(false);
  });

  it('deve executar teste de restauração dry-run com sucesso em snapshot válido', async () => {
    const snapshot = await backupManagerService.createSnapshot(testBackupsDir);
    const dryRunResult = await backupManagerService.testDryRunRestore(snapshot.filepath);

    expect(dryRunResult.success).toBe(true);
    expect(dryRunResult.durationMs).toBeGreaterThanOrEqual(0);
    expect(dryRunResult.message).toContain('sucesso');
  });

  it('deve falhar dry-run restore se o arquivo não existir', async () => {
    const nonExistentPath = path.join(testBackupsDir, 'does-not-exist.sqlite');
    const dryRunResult = await backupManagerService.testDryRunRestore(nonExistentPath);

    expect(dryRunResult.success).toBe(false);
    expect(dryRunResult.message).toContain('não encontrado');
  });
});
