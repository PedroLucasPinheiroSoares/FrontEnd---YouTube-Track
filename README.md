<p align="center">
  <a href="#" target="_blank">
    <img src="https://raw.githubusercontent.com/github/explore/main/topics/web-development/web-development.png" width="260" alt="StackHub Front-End">
  </a>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/stack-StackHub-2b9348" alt="Project"></a>
  <a href="#"><img src="https://img.shields.io/badge/tech-Bootstrap%205-563d7c" alt="Bootstrap"></a>
  <a href="#"><img src="https://img.shields.io/badge/tech-jQuery-0769ad" alt="jQuery"></a>
  <a href="#"><img src="https://img.shields.io/badge/tech-AJAX-4f83cc" alt="AJAX"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-lightgrey" alt="License"></a>
</p>

# StackHub — Front-End (Bootstrap + jQuery + AJAX)

**Interface web responsiva para consumo da API do projeto educativo StackHub (SENAI).**  
Este repositório contém a camada de apresentação que consome a API em Laravel via chamadas AJAX, exibindo métricas, filtros e controles de listagem de canais/projetos de forma dinâmica.

---

## ➤ Visão Rápida
- Front-end leve construído com **HTML5, Bootstrap 5 e jQuery**.  
- Carregamento dinâmico de dados via **AJAX/JSON** (integração com a API Laravel do back-end).  
- Projetado para fins **educacionais** e de portfólio — fácil de adaptar e estender.

---

## 🔧 Tecnologias
- HTML5 / CSS3  
- Bootstrap 5 (Grid, componentes, responsividade)  
- jQuery (DOM + AJAX)  
- JSON (consumo das respostas da API)  
- (Recomendado) Live Server / servidor estático para evitar problemas com CORS ao testar localmente

---

## 🚀 Pré-requisitos
- Navegador moderno (Chrome, Edge, Firefox)  
- Back-end (API Laravel) rodando localmente (ex.: XAMPP / php artisan serve) — ver nota **Sobre segurança & .gitignore** abaixo  
- Se for abrir por AJAX em `file://`, alguns navegadores bloqueiam as requisições — recomenda-se servir via HTTP (Live Server, `http-server`, ou `php -S localhost:5500`).

---

## ⚙️ Instalação e Execução (Front-End)
1. **Clonar repositório**
```bash
git clone https://github.com/seuusuario/stackhub-frontend.git
cd stackhub-frontend
