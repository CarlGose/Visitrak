const fs = require('fs');

const files = [
  'src/pages/user-form.jsx',
  'src/pages/VipLogs.jsx',
  'src/pages/Logs.jsx',
  'src/pages/Dashboard.jsx',
  'src/pages/Archives.jsx',
  'src/pages/VipQueue.jsx',
  'src/pages/GuardDashboard.jsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Dashboard, Logs, VipLogs, Archives, user-form, GuardDashboard (visitor_logs)
  content = content.replace(/\.order\('id',/g, '.order(\'logs_id\',');
  content = content.replace(/key=\{\`vip-\$\{log\.id\}\`\}/g, 'key={`vip-${log.logs_id}`}');
  content = content.replace(/key=\{\`log-\$\{log\.id\}\`\}/g, 'key={`log-${log.logs_id}`}');
  content = content.replace(/key=\{\`incampus-log-\$\{visitor\.id\}\`\}/g, 'key={`incampus-log-${visitor.logs_id}`}');
  content = content.replace(/key=\{\`archive-\$\{log\.id\}\`\}/g, 'key={`archive-${log.logs_id}`}');
  content = content.replace(/key=\{v\.id\} className=\"gl-row/g, 'key={v.logs_id} className=\"gl-row');
  content = content.replace(/\.eq\('id', log\.id\)/g, '.eq(\'logs_id\', log.logs_id)');
  content = content.replace(/\.eq\('id', existingActive\.id\)/g, '.eq(\'logs_id\', existingActive.logs_id)');

  // VipQueue.jsx specific
  if (f.includes('VipQueue.jsx')) {
    content = content.replace(/\.order\('logs_id',/g, '.order(\'vip_id\','); // fix the previous replace
    content = content.replace(/\.delete\(\)\.eq\('id', id\)/g, '.delete().eq(\'vip_id\', id)');
    content = content.replace(/key=\{\`queue-\$\{log\.id\}\`\}/g, 'key={`queue-${log.vip_id}`}');
    content = content.replace(/handleDelete\(log\.id\)/g, 'handleDelete(log.vip_id)');
  }

  // GuardDashboard.jsx vip queue specific
  if (f.includes('GuardDashboard.jsx')) {
    content = content.replace(/key=\{v\.id\} style=\{\{/g, 'key={v.vip_id} style={{');
    content = content.replace(/passengerCounts\[v\.id\]/g, 'passengerCounts[v.vip_id]');
    content = content.replace(/handlePassengerCountChange\(v\.id/g, 'handlePassengerCountChange(v.vip_id');
    content = content.replace(/\.delete\(\)\.eq\('id', vip\.id\)/g, '.delete().eq(\'vip_id\', vip.vip_id)');
    content = content.replace(/handleCancel\(v\.id\)/g, 'handleCancel(v.vip_id)');
    content = content.replace(/\.delete\(\)\.eq\('id', id\)/g, '.delete().eq(\'vip_id\', id)');
  }

  fs.writeFileSync(f, content);
});
