const STORAGE_KEY = 'portfolio-kit-data-v1';
const suppliedProjectRepositories = [
  'https://github.com/Madhura717/MelodyMind',
  'https://github.com/Madhura717/Civic_Issue',
  'https://github.com/Madhura717/MovieBooking',
  'https://github.com/Madhura717/SIH',
  'https://github.com/Madhura717/Protfolio'
];

const defaultData = {
  profile: {
    name: 'Madhura MS',
    headline: 'Computer Science student & builder',
    intro: 'I build clean, useful software and love turning ideas into products people enjoy.',
    about: 'I am a computer science student passionate about building thoughtful, well-crafted software. I enjoy working across the stack, from designing interfaces to writing reliable backend code. Outside class I lead student initiatives, contribute to projects, and keep learning new tools. I am currently looking for internships and entry-level roles.',
    initials: 'MS',
    email: 'you@example.com',
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-profile',
    resume: '#',
    photo: ''
  },
  skills: {
    languages: ['Python', 'Java', 'JavaScript', 'SQL'],
    web: ['HTML', 'CSS', 'JavaScript'],
    frameworks: ['React', 'Node.js', 'Git', 'Tailwind CSS'],
    tools: ['Git', 'GitHub', 'VS Code', 'Antigravity'],
  },
  projects: [
    { title: 'Project One', description: 'A short description of what this project does and the problem it solves.', stack: ['React', 'Node.js', 'PostgreSQL'], repository: suppliedProjectRepositories[0], image: '' },
    { title: 'Project Two', description: 'A data analysis dashboard surfacing insights from a public dataset.', stack: ['Python', 'Pandas', 'Power BI'], repository: suppliedProjectRepositories[1], image: '' },
    { title: 'Project Three', description: 'A mobile-friendly web app that helps students organise their studies.', stack: ['JavaScript', 'Firebase', 'Tailwind'], repository: suppliedProjectRepositories[2], image: '' },
    { title: 'SIH', description: 'Add a description for your SIH project.', stack: ['Technology'], repository: suppliedProjectRepositories[3], image: '' },
    { title: 'Protfolio', description: 'Add a description for your portfolio project.', stack: ['HTML', 'CSS', 'JavaScript'], repository: suppliedProjectRepositories[4], image: '' }
  ],
  experience: [
    { date: 'May 2026 – Jul 2026', role: 'Software Intern', company: 'Company Name', bullets: ['Built features used by real customers.', 'Improved page load time by 30%.'] },
    { date: '2025 – Present', role: 'Technical Lead', company: 'College Coding Club', bullets: ['Organised workshops for 200+ students.', 'Mentored juniors on their first projects.'] }
  ],
  education: [
    { date: '2023 – 2027', degree: 'B.E. / B.Tech in Computer Science', school: 'Your College Name', detail: 'CGPA: 9.0 / 10' },
    { date: '2021 – 2023', degree: 'Higher Secondary (XII)', school: 'Your School Name', detail: 'Score: 95%' }
  ],
  certifications: [
    { title: 'HackerIn 1.0', issuer: 'Hackathon', year: '2026', placement: '6th Place' },
    { title: 'WeHack 1.0', issuer: 'Hackathon', year: '2026', placement: '1st Place' }
  ]
};

const editor = document.querySelector('#editor');
const preview = document.querySelector('#portfolio-preview');
const statusEl = document.querySelector('#save-status');

let data = loadData();

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return deepClone(defaultData);
    const parsed = JSON.parse(saved);
    parsed.skills = { ...deepClone(defaultData.skills), ...(parsed.skills || {}) };
    if (!Array.isArray(parsed.skills.web) || parsed.skills.web.length === 0) parsed.skills.web = deepClone(defaultData.skills.web);
    if (!Array.isArray(parsed.skills.tools) || parsed.skills.tools.length === 0) parsed.skills.tools = deepClone(defaultData.skills.tools);
    if (!parsed.skills.tools.includes('Antigravity')) parsed.skills.tools.push('Antigravity');
    delete parsed.skills.data;
    if (Array.isArray(parsed.projects)) parsed.projects.forEach((project) => { delete project.live; delete project.github; if (typeof project.repository !== 'string') project.repository = ''; });
    if (!parsed.projectRepositoriesAdded) {
      while (parsed.projects.length < defaultData.projects.length) parsed.projects.push(deepClone(defaultData.projects[parsed.projects.length]));
      suppliedProjectRepositories.forEach((repository, index) => { parsed.projects[index].repository = repository; });
      parsed.projectRepositoriesAdded = true;
    }
    if (parsed.profile?.name === 'Madhura M. S.') parsed.profile.name = defaultData.profile.name;
    if (parsed.profile?.initials === 'MM') parsed.profile.initials = defaultData.profile.initials;
    if (parsed.certifications?.some((item) => item.title === 'Certification Name' || item.title === 'Hackathon Winner')) parsed.certifications = deepClone(defaultData.certifications);
    return parsed;
  } catch {
    return deepClone(defaultData);
  }
}

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}

function attr(value = '') { return esc(value); }
function lines(value = '') { return String(value).split(/\n|,/).map((item) => item.trim()).filter(Boolean); }
function textLines(items = []) { return items.join('\n'); }
function safeUrl(url = '#') {
  const value = String(url).trim();
  if (!value || value === '#') return '#';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(value)) return value;
  return `https://${value}`;
}
function setStatus(message, tone = 'success') {
  statusEl.textContent = message;
  statusEl.style.color = tone === 'error' ? 'var(--coral)' : 'var(--green)';
}
function persist(message = 'Saved in this browser') {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  setStatus(message);
}
function getPath(path) {
  return path.split('.').reduce((current, key) => current?.[key], data);
}
function setPath(path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((current, key) => current[key], data);
  target[last] = value;
}

function inputField(label, path, value, options = {}) {
  const tag = options.textarea ? 'textarea' : 'input';
  const type = options.type || 'text';
  const classes = options.full ? 'field full' : 'field';
  const placeholder = options.placeholder ? ` placeholder="${attr(options.placeholder)}"` : '';
  const help = options.help ? `<small>${esc(options.help)}</small>` : '';
  const content = tag === 'textarea' ? esc(value) : '';
  const valueAttr = tag === 'input' ? ` value="${attr(value)}"` : '';
  return `<div class="${classes}"><label for="field-${path.replaceAll('.', '-').replaceAll('[', '-').replaceAll(']', '')}">${esc(label)}</label><${tag} id="field-${path.replaceAll('.', '-').replaceAll('[', '-').replaceAll(']', '')}" data-path="${attr(path)}" type="${type}"${valueAttr}${placeholder}>${content}${tag === 'textarea' ? '</textarea>' : ''}${help}</div>`;
}

function repeatedField(label, collection, index, field, value, options = {}) {
  const tag = options.textarea ? 'textarea' : 'input';
  const type = options.type || 'text';
  const placeholder = options.placeholder ? ` placeholder="${attr(options.placeholder)}"` : '';
  const content = tag === 'textarea' ? esc(value) : '';
  const valueAttr = tag === 'input' ? ` value="${attr(value)}"` : '';
  return `<div class="field ${options.full ? 'full' : ''}"><label>${esc(label)}</label><${tag} data-collection="${collection}" data-index="${index}" data-field="${field}" type="${type}"${valueAttr}${placeholder}>${content}${tag === 'textarea' ? '</textarea>' : ''}</div>`;
}

function repeatSection(title, help, collection, items, renderItem, addLabel) {
  return `<section class="editor-section"><h3>${esc(title)}</h3><p class="section-help">${esc(help)}</p><div class="repeat-list">${items.map((item, index) => renderItem(item, index)).join('')}</div><button type="button" class="add-button" data-add="${collection}">+ ${esc(addLabel)}</button></section>`;
}

function renderEditor() {
  const p = data.profile;
  editor.innerHTML = `
    <section class="editor-section">
      <h3>Basics</h3>
      <p class="section-help">These details appear in the hero and contact area.</p>
      <div class="form-grid">
        ${inputField('Name', 'profile.name', p.name)}
        ${inputField('Initials', 'profile.initials', p.initials, { placeholder: 'MM' })}
        ${inputField('Headline', 'profile.headline', p.headline, { full: true })}
        ${inputField('Short intro', 'profile.intro', p.intro, { textarea: true, full: true })}
        ${inputField('About you', 'profile.about', p.about, { textarea: true, full: true })}
        ${inputField('Email', 'profile.email', p.email, { type: 'email' })}
        ${inputField('GitHub URL', 'profile.github', p.github, { placeholder: 'https://github.com/...' })}
        ${inputField('LinkedIn URL', 'profile.linkedin', p.linkedin, { placeholder: 'https://linkedin.com/in/...' })}
        ${inputField('Resume URL', 'profile.resume', p.resume, { placeholder: 'Link to your PDF or resume page' })}
        <div class="field full file-picker"><label for="photo-file">Profile photo (optional)</label><input id="photo-file" type="file" accept="image/*" /><small>${p.photo ? 'A local photo is saved in this browser. Choose another to replace it.' : 'Upload a photo if you prefer it over initials. It stays in this browser.'}</small></div>
      </div>
    </section>
    <section class="editor-section">
      <h3>Skills</h3>
      <p class="section-help">One skill per line, or separate skills with commas.</p>
      <div class="form-grid">
        ${inputField('Languages', 'skills.languages', textLines(data.skills.languages), { textarea: true })}
        ${inputField('Web', 'skills.web', textLines(data.skills.web), { textarea: true })}
        ${inputField('Frameworks & tools', 'skills.frameworks', textLines(data.skills.frameworks), { textarea: true })}
        ${inputField('Tools', 'skills.tools', textLines(data.skills.tools), { textarea: true })}
      </div>
    </section>
    ${repeatSection('Projects', 'Add a snapshot and repository URL for each project. These fields are editable only inside your portfolio editor.', 'projects', data.projects, (item, index) => `<article class="repeat-item"><div class="repeat-head"><span class="repeat-number">Project ${String(index + 1).padStart(2, '0')}</span>${data.projects.length > 1 ? `<button type="button" class="remove-button" data-remove="projects" data-index="${index}">Remove</button>` : ''}</div><div class="form-grid">${repeatedField('Project title', 'projects', index, 'title', item.title)}${repeatedField('Technology tags', 'projects', index, 'stack', textLines(item.stack))}${repeatedField('Description', 'projects', index, 'description', item.description, { textarea: true, full: true })}${repeatedField('Git repository URL (add later)', 'projects', index, 'repository', item.repository || '', { full: true, placeholder: 'https://github.com/your-username/project' })}<div class="field full file-picker"><label>Project snapshot</label><input type="file" accept="image/*" data-project-photo="${index}" /><small>${item.image ? 'Snapshot saved in this browser. Choose another to replace it.' : 'Upload one project screenshot or snapshot.'}</small></div></div></article>`, 'Add project')}
    ${repeatSection('Experience & leadership', 'List internships, jobs, clubs, volunteering, or leadership roles.', 'experience', data.experience, (item, index) => `<article class="repeat-item"><div class="repeat-head"><span class="repeat-number">Role ${String(index + 1).padStart(2, '0')}</span>${data.experience.length > 1 ? `<button type="button" class="remove-button" data-remove="experience" data-index="${index}">Remove</button>` : ''}</div><div class="form-grid">${repeatedField('Date', 'experience', index, 'date', item.date)}${repeatedField('Role', 'experience', index, 'role', item.role)}${repeatedField('Company / organisation', 'experience', index, 'company', item.company)}${repeatedField('Highlights', 'experience', index, 'bullets', textLines(item.bullets), { textarea: true, full: true })}</div></article>`, 'Add experience')}
    ${repeatSection('Education', 'Add your degree, school, or other education details.', 'education', data.education, (item, index) => `<article class="repeat-item"><div class="repeat-head"><span class="repeat-number">Education ${String(index + 1).padStart(2, '0')}</span>${data.education.length > 1 ? `<button type="button" class="remove-button" data-remove="education" data-index="${index}">Remove</button>` : ''}</div><div class="form-grid">${repeatedField('Date', 'education', index, 'date', item.date)}${repeatedField('Degree / qualification', 'education', index, 'degree', item.degree)}${repeatedField('School / college', 'education', index, 'school', item.school)}${repeatedField('Score or detail', 'education', index, 'detail', item.detail, { full: true })}</div></article>`, 'Add education')}
    ${repeatSection('Certifications & achievements', 'HackerIn 1.0 and WeHack 1.0 are highlighted here with their placement shown in a small badge.', 'certifications', data.certifications, (item, index) => `<article class="repeat-item"><div class="repeat-head"><span class="repeat-number">Achievement ${String(index + 1).padStart(2, '0')}</span>${data.certifications.length > 1 ? `<button type="button" class="remove-button" data-remove="certifications" data-index="${index}">Remove</button>` : ''}</div><div class="form-grid">${repeatedField('Title', 'certifications', index, 'title', item.title)}${repeatedField('Year', 'certifications', index, 'year', item.year)}${repeatedField('Issuer / event', 'certifications', index, 'issuer', item.issuer)}${repeatedField('Placement / result', 'certifications', index, 'placement', item.placement || '', { full: true })}</div></article>`, 'Add certification')}
    <section class="editor-section editor-actions"><button type="button" class="button button-primary" id="save-now">Save now</button><button type="button" class="button button-secondary" id="scroll-preview">Jump to preview</button><p class="section-help" style="margin:0">Your details are stored locally in this browser. Use Export JSON for a backup before switching devices.</p></section>
  `;
}

function renderPreview() {
  const p = data.profile;
  const socialLinks = [
    p.linkedin ? `<a href="${attr(safeUrl(p.linkedin))}" target="_blank" rel="noreferrer">LinkedIn</a>` : '',
    p.github ? `<a href="${attr(safeUrl(p.github))}" target="_blank" rel="noreferrer">GitHub</a>` : '',
    p.email ? `<a href="mailto:${attr(p.email)}">Email</a>` : ''
  ].join('');
  const socialIcons = {
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .7a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v2.7c0 .3.2.7.8.6A12 12 0 0 0 12 .7Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5A2.2 2.2 0 1 1 .8 3.5a2.2 2.2 0 0 1 4.4 0ZM1 8h4.3v13H1V8Zm6.9 0h4.1v1.8h.1c.6-1.1 2-2.2 4.1-2.2 4.4 0 5.2 2.9 5.2 6.7V21h-4.3v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H7.9V8Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 5.5h19v13h-19v-13Zm1.5 1.8 8 5.6 8-5.6M4 17l5.4-5.1m10.6 5.1-5.4-5.1"/></svg>'
  };
  const heroSocials = [
    p.github ? `<a class="hero-social" href="${attr(safeUrl(p.github))}" target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub">${socialIcons.github}</a>` : '',
    p.email ? `<a class="hero-social" href="mailto:${attr(p.email)}" aria-label="Email" title="Email">${socialIcons.email}</a>` : '',
    p.linkedin ? `<a class="hero-social" href="${attr(safeUrl(p.linkedin))}" target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn">${socialIcons.linkedin}</a>` : ''
  ].filter(Boolean).join('');
  const avatar = esc((p.name || 'M').trim().charAt(0).toUpperCase() || 'M');
  const skillGroup = (title, items) => `<div class="skill-group"><h3>${esc(title)}</h3><div class="tag-list">${items.length ? items.map((item) => `<span class="tag">${esc(item)}</span>`).join('') : '<span class="empty-state">Add skills in the editor.</span>'}</div></div>`;
  const projects = data.projects.length ? data.projects.map((item) => `<article class="project-card"><div class="project-image">${item.image ? `<img src="${attr(item.image)}" alt="${attr(item.title)} snapshot" />` : '<span>Add project snapshot</span>'}</div><div class="project-card-body"><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${item.repository ? `<a class="project-repository" href="${attr(safeUrl(item.repository))}" target="_blank" rel="noreferrer"><span aria-hidden="true">⌘</span> Git repo <span aria-hidden="true">↗</span></a>` : ''}<div class="project-stack">${item.stack.map((tag) => `<span>${esc(tag)}</span>`).join('')}</div></div></article>`).join('') : '<p class="empty-state">Add a project in the editor.</p>';
  const experience = data.experience.length ? data.experience.map((item) => `<article class="timeline-item"><div class="timeline-date">${esc(item.date)}</div><div><h3>${esc(item.role)}</h3><p class="timeline-company">${esc(item.company)}</p><ul>${item.bullets.map((bullet) => `<li>${esc(bullet)}</li>`).join('')}</ul></div></article>`).join('') : '<p class="empty-state">Add experience in the editor.</p>';
  const education = data.education.length ? data.education.map((item) => `<article class="education-card"><div class="card-meta">${esc(item.date)}</div><h3>${esc(item.degree)}</h3><p>${esc(item.school)}<br />${esc(item.detail)}</p></article>`).join('') : '<p class="empty-state">Add education in the editor.</p>';
  const certifications = data.certifications.length ? data.certifications.map((item) => `<article class="cert-card"><div class="achievement-top"><div class="card-meta">${esc(item.year)}</div>${item.placement ? `<span class="achievement-badge">${esc(item.placement)}</span>` : ''}</div><h3>${esc(item.title)}</h3><p>${esc(item.issuer)}</p></article>`).join('') : '<p class="empty-state">Add an achievement in the editor.</p>';

  preview.innerHTML = `<nav class="portfolio-nav"><a class="preview-brand" href="#preview-top">${esc(p.initials || 'PK')}.</a><div class="preview-nav"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#education">Education</a><a href="#certifications">Achievements</a><a href="#contact">Contact</a></div></nav><div id="preview-top"></div><section class="preview-hero"><div class="avatar">${avatar}</div><div><p class="hero-kicker">${esc(p.headline)}</p><h1>${esc(p.name)}</h1><p class="hero-copy">${esc(p.intro)}</p><div class="hero-actions"><a class="preview-cta" href="#projects">View projects <span aria-hidden="true">↗</span></a><a class="preview-cta secondary" href="#contact">Contact <span aria-hidden="true">↗</span></a></div><div class="hero-socials">${heroSocials}</div></div></section><section class="preview-section" id="about"><div class="preview-section-heading"><div><p class="eyebrow">01 / About me</p><h2>A little context.</h2></div><p class="preview-section-intro">The short version of what I care about and how I work.</p></div><div class="about-layout"><div class="about-photo">${p.photo ? `<img src="${attr(p.photo)}" alt="${attr(p.name)}" />` : '<span>Add your photo</span>'}</div><p class="about-copy">${esc(p.about)}</p></div></section><section class="preview-section alt" id="skills"><div class="preview-section-heading"><div><p class="eyebrow">02 / Skills</p><h2>Tools I use.</h2></div></div><div class="skill-columns">${skillGroup('Languages', data.skills.languages)}${skillGroup('Web', data.skills.web || [])}${skillGroup('Frameworks & tools', data.skills.frameworks)}${skillGroup('Tools', data.skills.tools || [])}</div></section><section class="preview-section" id="projects"><div class="preview-section-heading"><div><p class="eyebrow">03 / Projects</p><h2>Projects</h2></div><p class="preview-section-intro">A visual look at the work I have built and explored.</p></div><div class="project-grid">${projects}</div></section><section class="preview-section alt" id="experience"><div class="preview-section-heading"><div><p class="eyebrow">04 / Experience</p><h2>Where I have contributed.</h2></div></div><div class="timeline">${experience}</div></section><section class="preview-section" id="education"><div class="preview-section-heading"><div><p class="eyebrow">05 / Education</p><h2>Academic background.</h2></div></div><div class="education-grid">${education}</div></section><section class="preview-section alt" id="certifications"><div class="preview-section-heading"><div><p class="eyebrow">06 / Achievements</p><h2>Highlights & achievements.</h2></div></div><div class="cert-grid">${certifications}</div></section><section class="preview-section contact-section" id="contact"><div><p class="eyebrow">07 / Get in touch</p><h2>Let’s make something useful.</h2><p>Reach me through Gmail or connect with me on LinkedIn.</p></div><div class="contact-actions">${p.email ? `<a class="contact-email" href="mailto:${attr(p.email)}">${esc(p.email)} ↗</a>` : ''}${p.linkedin ? `<a class="contact-social" href="${attr(safeUrl(p.linkedin))}" target="_blank" rel="noreferrer">LinkedIn profile ↗</a>` : ''}</div></section><footer class="preview-footer"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span><div class="footer-links">${socialLinks}</div></footer>`;
}

function updateCollectionField(collection, index, field, rawValue) {
  const item = data[collection][index];
  if (!item) return;
  item[field] = ['stack', 'bullets'].includes(field) ? lines(rawValue) : rawValue;
}

function addItem(collection) {
  const templates = {
    projects: { title: 'New project', description: 'What did you build and why?', stack: ['Technology'], repository: '', image: '' },
    experience: { date: 'Date range', role: 'Role title', company: 'Company or organisation', bullets: ['A contribution or result.'] },
    education: { date: 'Years', degree: 'Qualification', school: 'School or college', detail: 'Score or detail' },
    certifications: { title: 'Achievement or certification', issuer: 'Issuer or event', year: '2026', placement: '' }
  };
  data[collection].push(deepClone(templates[collection]));
  persist('Added item');
  renderEditor();
  renderPreview();
}

editor.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.path) {
    const value = target.dataset.path.startsWith('skills.') ? lines(target.value) : target.value;
    setPath(target.dataset.path, value);
  } else if (target.dataset.collection) {
    updateCollectionField(target.dataset.collection, Number(target.dataset.index), target.dataset.field, target.value);
  }
  persist();
  renderPreview();
});

editor.addEventListener('change', async (event) => {
  if (event.target.dataset.projectPhoto !== undefined && event.target.files?.[0]) {
    const file = event.target.files[0];
    if (!file.type.startsWith('image/')) { setStatus('Please choose an image file', 'error'); return; }
    if (file.size > 2 * 1024 * 1024) { setStatus('Please choose an image under 2 MB', 'error'); return; }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      data.projects[Number(event.target.dataset.projectPhoto)].image = reader.result;
      persist('Project snapshot saved');
      renderEditor();
      renderPreview();
    });
    reader.readAsDataURL(file);
    return;
  }
  if (event.target.id !== 'photo-file' || !event.target.files?.[0]) return;
  const file = event.target.files[0];
  if (!file.type.startsWith('image/')) { setStatus('Please choose an image file', 'error'); return; }
  if (file.size > 2 * 1024 * 1024) { setStatus('Please choose an image under 2 MB', 'error'); return; }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    data.profile.photo = reader.result;
    persist('Photo saved');
    renderEditor();
    renderPreview();
  });
  reader.readAsDataURL(file);
});

editor.addEventListener('click', (event) => {
  const add = event.target.closest('[data-add]');
  if (add) { addItem(add.dataset.add); return; }
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    data[remove.dataset.remove].splice(Number(remove.dataset.index), 1);
    persist('Item removed');
    renderEditor();
    renderPreview();
    return;
  }
  if (event.target.id === 'save-now') { persist('Saved in this browser'); return; }
  if (event.target.id === 'scroll-preview') { document.querySelector('.preview-panel').scrollIntoView({ behavior: 'smooth' }); }
});

document.querySelector('#export-button').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${(data.profile.name || 'portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-portfolio.json`;
  link.click();
  URL.revokeObjectURL(url);
  setStatus('JSON backup downloaded');
});

document.querySelector('#import-button').addEventListener('click', () => document.querySelector('#import-file').click());
document.querySelector('#import-file').addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!imported.profile || !imported.skills || !Array.isArray(imported.projects)) throw new Error('This file is not a Portfolio Kit backup.');
      data = imported;
      persist('Backup imported');
      renderEditor();
      renderPreview();
    } catch (error) {
      setStatus(error.message || 'Could not import that file', 'error');
    }
    event.target.value = '';
  });
  reader.readAsText(file);
});

document.querySelector('#reset-button').addEventListener('click', () => {
  if (!window.confirm('Reset all fields to the starter placeholders? Your current browser-saved details will be replaced.')) return;
  data = deepClone(defaultData);
  persist('Reset to placeholders');
  renderEditor();
  renderPreview();
});

renderEditor();
renderPreview();
