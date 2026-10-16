<script setup lang="ts">
const skills = [
  'TypeScript / JavaScript (ES6+)',
  'Vue 3 (Composition API, Vue Router, Pinia)',
  'HTML5, CSS3, SCSS, Bootstrap 5',
  'REST API Integration & Repository Pattern',
  'VeeValidate & Yup Schema Validation',
  'Git & GitHub Workflow (Conventional Commits)',
  'Vite & Webpack',
]
</script>

<template>
  <section class="content-card about-view">
    <h1 class="page-title">Про автора (About Author)</h1>

    <div class="author-profile">
      <div class="avatar-circle">ВІ</div>
      <div class="author-info">
        <h2 class="author-name">Іванів Владислав</h2>
        <p class="author-role">Студент курсу «Інженерія клієнтських веб-систем»</p>
        <p class="author-links">
          GitHub акаунт:
          <a
            href="https://github.com/kartoha28"
            target="_blank"
            rel="noopener noreferrer"
            class="github-link"
          >
            github.com/kartoha28 &#8599;
          </a>
        </p>
      </div>
    </div>

    <div class="skills-block">
      <h3 class="skills-title">Technical Skills</h3>
      <div class="skills-badges">
        <span v-for="skill in skills" :key="skill" class="skill-badge">
          {{ skill }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-title {
  font-size: 1.65rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #212529;
}

.author-profile {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

.author-name {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #212529;
}

.author-role {
  color: #6c757d;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

.author-links {
  margin: 0;
  font-size: 0.95rem;
}

.github-link {
  font-weight: 600;
  color: #0d6efd;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.skills-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.85rem;
  color: #343a40;
}

.skills-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-badge {
  background-color: #e7f1ff;
  color: #084298;
  border: 1px solid #b6d4fe;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
