#  Automatisation d'une application To-Do List avec Docker Compose

##  Réalisé par
- El Bouazaoui Mouna  
- El Aissaoui Meryam 
- El Ghazi Asmae  
- El Ghazali Rihab  

##  Lien du projet
 https://github.com/ellbouazaouimouna-maker/Projet-TO-DO-LIST-avec-DOCKER

---

##  1. Introduction

Ce projet a pour objectif d'automatiser le déploiement d'une application web **To-Do List** en utilisant **Docker Compose**.

L'application permet de gérer des tâches quotidiennes via :
-  un backend en **Flask (Python)**
-  une base de données **PostgreSQL**
-  un frontend en **HTML / JavaScript**

L'objectif principal est de créer une architecture **multi-conteneurs**, **reproductible** et **facile à déployer**.

---

##  2. Objectifs

- Automatiser le déploiement d'une application complète  
- Assurer la cohérence entre les environnements  
- Réduire les erreurs de configuration  
- Centraliser la configuration avec Docker Compose  
- Lancer toute l'application avec une seule commande  

---


---

##  3. Répartition des tâches

| Étudiante               | Responsabilité |
|------------------------|--------------|
| El Ghazi Asmae         | Développement Flask (backend + frontend) |
| El Bouazaoui Mouna     | Base de données PostgreSQL |
| El Aissaoui Meryam     | Dockerisation (Dockerfile) |
| El Ghazali Rihab       | Docker Compose + déploiement |

---

##  4. Architecture du projet

L'application repose sur **2 conteneurs Docker** :

-  **Backend (Flask)** : logique métier + API REST  
-  **PostgreSQL** : stockage des tâches  

💡 Le frontend fonctionne dans le navigateur et communique avec le backend via HTTP.

---

##  5. Configuration

Les fichiers principaux :

- `docker-compose.yml` → orchestration des services  
- `.env` → variables sensibles (mot de passe, base de données, etc.)  

---

##  6. Technologies utilisées

| Technologie | Rôle |
|------------|------|
| Docker & Docker Compose | Conteneurisation et orchestration |
| Flask (Python) | Backend + API |
| PostgreSQL | Base de données |
| HTML / JavaScript | Interface utilisateur |
| psycopg2 | Connexion Python ↔ PostgreSQL |
| dotenv (.env) | Variables d’environnement |
| Git & GitHub | Gestion de version |

---

##  7. Livrables

-  Application web complète  
-  Base de données initialisée  
-  Image Docker du backend  
-  Orchestration avec Docker Compose  

---

##  8. Structure du projet

```bash
Projet-TO-DO-LIST-avec-DOCKER/
│
├── docker-compose.yml
├── .env
├── .gitignore
│
├── web/
│   ├── Dockerfile
│   ├── app.py
│   ├── requirements.txt
│   └── templates/
│       ├── index.html
│       └── script.js
│
└── db/
    └── init.sql
```

---


##  9. Déploiement

###  Lancer l'application

```bash
docker compose up --build
```

## Accès

Ouvrir dans le navigateur :
 http://localhost:5000

---

## 10. Tests

Fonctionnalités vérifiées :

 Affichage des tâches
 Ajout de tâches
 Suppression
 Marquage comme terminée
 Sauvegarde dans la base

---


## 11. Arrêt de l'application
docker compose down

---

## 12. Workflow GitHub
Travail en branches individuelles
Utilisation de Pull Requests
Fusion progressive dans la branche principale

---


## 13. Conclusion

Ce projet démontre l’intérêt de Docker Compose pour :

 - Simplifier le déploiement
 - Garantir la reproductibilité
 - Séparer les services proprement
 - Faciliter le travail en équipe
