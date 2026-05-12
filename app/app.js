const jobs = [];

const form = document.getElementById('jobForm');
const tableBody = document.getElementById('jobsTableBody');
const message = document.getElementById('formMessage');
const demoFillBtn = document.getElementById('demoFillBtn');

function renderJobs() {
  tableBody.innerHTML = '';
  jobs.forEach((job, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${job.videoId}</td>
      <td>${job.workspace}</td>
      <td><span class="status ${job.status.toLowerCase()}">${job.status}</span></td>
      <td>${job.url ? `<a href="${job.url}" target="_blank" rel="noopener">Open Asset</a>` : '-'}</td>
      <td><button class="btn ghost send-btn" data-index="${index}" ${job.status !== 'Completed' ? 'disabled' : ''}>Send to GHL</button></td>
    `;
    tableBody.appendChild(tr);
  });

  document.querySelectorAll('.send-btn').forEach((btn) => {
    btn.addEventListener('click', () => sendToGhl(Number(btn.dataset.index)));
  });
}

function createFakePipeline(job) {
  setTimeout(() => { job.status = 'Generating'; renderJobs(); }, 900);
  setTimeout(() => {
    job.status = 'Completed';
    job.url = `https://drive.google.com/file/d/${job.videoId}`;
    renderJobs();
  }, 2800);
}

async function sendToGhl(index) {
  const job = jobs[index];
  const webhookUrl = document.getElementById('n8nWebhookUrl').value.trim();
  const locationId = document.getElementById('ghlLocationId').value.trim();
  const ghlPit = document.getElementById('ghlPit').value.trim();

  if (!webhookUrl) {
    message.textContent = 'Add your n8n webhook URL first.';
    return;
  }

  try {
    const payload = {
      locationId,
      pit: ghlPit,
      videoId: job.videoId,
      workspace: job.workspace,
      niche: job.niche,
      priority: job.priority,
      idea: job.idea,
      assetUrl: job.url,
      sentAt: new Date().toISOString()
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Webhook error ${res.status}`);
    message.textContent = `Sent ${job.videoId} to GHL via n8n successfully.`;
  } catch (err) {
    message.textContent = `Failed to send ${job.videoId} to GHL: ${err.message}`;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  const job = {
    videoId: document.getElementById('videoId').value.trim(),
    workspace: document.getElementById('workspace').value.trim(),
    niche: document.getElementById('niche').value.trim(),
    priority: document.getElementById('priority').value,
    idea: document.getElementById('idea').value.trim(),
    status: 'Queued',
    url: ''
  };

  jobs.unshift(job);
  renderJobs();
  createFakePipeline(job);
  message.textContent = 'Job created. Wait for Completed, then click Send to GHL.';
  form.reset();
  document.getElementById('ghlLocationId').value = '8BlvEgHfpyevZboFrRry';
});

demoFillBtn.addEventListener('click', () => {
  document.getElementById('videoId').value = `voltx_${Date.now().toString().slice(-6)}`;
  document.getElementById('workspace').value = 'Voltixio Content Ops';
  document.getElementById('niche').value = 'AI Automation for SMBs';
  document.getElementById('idea').value = 'Show a before/after content workflow transformation for a client.';
  document.getElementById('url1').value = 'https://images.example.com/voltixio-ref-1.jpg';
  document.getElementById('url2').value = 'https://images.example.com/voltixio-ref-2.jpg';
  document.getElementById('url3').value = 'https://images.example.com/voltixio-ref-3.jpg';
});

renderJobs();
