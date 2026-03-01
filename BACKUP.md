# Aurum Node - Backup Strategy

## Layer 1: Daily MySQL dump

Create `/opt/scripts/backup-db.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR=/var/backups/aurum-node
mkdir -p $BACKUP_DIR
mysqldump -u <user> -p<password> aurum_node | gzip > $BACKUP_DIR/db-$DATE.sql.gz
# Keep last 7 days
find $BACKUP_DIR -name "db-*.sql.gz" -mtime +7 -delete
```

Cron: `0 2 * * * /opt/scripts/backup-db.sh`

## Layer 2: Offsite sync (S3/Backblaze B2)

Use `aws s3 sync` or `rclone`:

```bash
# Example with rclone to B2
rclone sync /var/backups/aurum-node remote:bucket/aurum-backups --include "*.sql.gz"
```

## Layer 3: Weekly VPS snapshot

Use your VPS provider's snapshot feature (DigitalOcean, Linode, AWS, etc.) to create weekly images.
