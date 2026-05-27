# Smart Warehouse - Projet Qualimétrie (Sujet 10)

## Présentation du projet

Ce projet est une démonstration de l’intégration de la **Qualimétrie Logicielle** dans un cycle de développement moderne avec **CI/CD**.

L’objectif principal est de mesurer, analyser et améliorer la qualité du code d’une API de gestion de stock grâce aux outils d’automatisation, de tests et d’audit qualité.

Projet réalisé dans le cadre du **TP de Qualimétrie Logicielle**.

---

# Équipe de développement

| Membre | Rôle |
|---|---|
| Membre A | Ingénieur DevOps | Sedera |
| Membre B | Développeur Principal | Rojo |
| Membre C | Spécialiste Tests & Qualité | Holisoa |

---

# Guide d'installation

## 1. Cloner le projet

```bash
git clone <https://github.com/RojoIrina/Projet-Qualimetrie-Smart-Warehouse.git>
```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Lancer le serveur

```bash
node index.js
```

Le serveur démarre localement sur le port configuré dans le projet.

---

## Avant de commencer à travailler

```bash
git pull origin main
```

## Après les modifications

```bash
git add .
git commit -m "Description des modifications"
git push origin main
```


# Structure du Pipeline CI/CD

Le pipeline est automatisé avec **GitHub Actions**.

Fichier principal :

```text
.github/workflows/ci.yml
```

À chaque `push`, le pipeline exécute automatiquement :

## 1. Linter (ESLint)

C’est un outil qui permet d’analyser le code et d’identifier les erreurs et les points d’amélioration :
- Vérification des bonnes pratiques
- Contrôle de la complexité cyclomatique
- Détection du code problématique

### Installation

```bash
npm install --save-dev eslint
```

### Initialisation et configuration

```bash
npx eslint --init
```

Cette commande sert à configurer automatiquement ESLint et de créer le fichier eslint.config.mjs

#### Exemple de configuration Eslint

```eslint.config.mjs
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "no-var": "error"
    }
  }
];
```

---

## 2. Tests Unitaires (Jest)

Jest est un framework de test JavaScript qui sert à trois choses précises :
- Vérification des fonctionnalités métier
- Génération du rapport de couverture (coverage/lcov.info) que SonarCloud lit pour afficher le pourcentage
- Bloquer le pipeline si un test échoue ou si la couverture est sous 70%

### Installation

```bash
npm install --save-dev jest
```

### Fichier de configuration : jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    'routes/**/*.js'
  ],
  coverageReporters: ['lcov', 'text', 'clover'],
  coverageDirectory: 'coverage'
};
```

### Exemple de test Jest dans le fichiers /test/warehouse.test.js

```javascript
const { checkStock } = require('../src/warehouse');

describe('Statut CRITIQUE', () => {

  test('Retourne rupture si stock = 0', () => {
    const result = checkStock({
      stock: 0,
      seuil: 20,
      produit: { nom: 'Vis', type: 'Normal' },
      fournisseur: 'Etranger',
      periode: 'Normal'
    });
    expect(result.status).toBe('CRITIQUE');
  });

});

```
### Lancement du test

```bash
npm test
```

---

## 3. Analyse SonarCloud

- Dette technique
- Bugs potentiels
- Vulnérabilités
- Duplication de code
- Maintenabilité

### Exemple de configuration SonarCloud

```properties
sonar.projectKey=smart-warehouse
sonar.organization=team-qualimetrie
sonar.sources=src
sonar.tests=tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

---

## 🚦 4. Quality Gate

Le pipeline est bloqué automatiquement si :

- ❌ Complexité cyclomatique > 10
- ❌ Couverture de tests < 70%
- ❌ Échec des tests
- ❌ Échec du Quality Gate Sonar

---

# 📂 Structure du projet

```text
smart-warehouse/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── tests/
│   └── warehouse.test.js
│
├── src/
│   └── warehouse.js
│
├── index.js
├── package.json
├── sonar-project.properties
├── .eslintrc.json
└── README.md
```

---

# 📈 Cycle PDCA du projet

## 🟢 1. PLAN — Initialisation (Membre B)

Création d’un code volontairement complexe :

- Forte dette technique
- Conditions imbriquées
- Complexité élevée
- Absence de tests

### Exemple de code “Spaghetti”

```javascript
function processOrder(stock, isPaid, isPriority) {
  if (stock > 0) {
    if (isPaid) {
      if (isPriority) {
        return "Commande prioritaire validée";
      } else {
        return "Commande validée";
      }
    } else {
      return "Paiement requis";
    }
  } else {
    return "Stock insuffisant";
  }
}
```

---

## 🟡 2. DO — Audit Qualité (Membre A)

Mise en place des outils :

- ESLint
- SonarCloud
- Analyse de complexité

### Configuration ESLint

```json
{
  "env": {
    "node": true,
    "jest": true
  },
  "extends": "eslint:recommended",
  "rules": {
    "complexity": ["error", 5]
  }
}
```

---

## 🔵 3. CHECK — Gardien Qualité (Membre A)

Création du pipeline CI/CD :

- Automatisation des vérifications
- Blocage des erreurs
- Intégration GitHub Actions

### Exemple de fichier `ci.yml`

```yaml
name: CI Pipeline

on:
  push:
    branches:
      - main

jobs:
  quality-check:
    runs-on: ubuntu-latest

    steps:
      - name: Cloner le projet
        uses: actions/checkout@v3

      - name: Installer Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Installer les dépendances
        run: npm install

      - name: Exécuter ESLint
        run: npx eslint .

      - name: Exécuter les tests
        run: npm test -- --coverage

      - name: SonarCloud Scan
        run: echo "Analyse SonarCloud"
```

---

## 🟣 4. ACT — Refactoring (Membre C)

Amélioration du code :

- Refactoring
- Early Returns
- Réduction des conditions imbriquées
- Ajout de tests Jest
- Amélioration de la couverture

### Exemple de refactoring

```javascript
function processOrder(stock, isPaid, isPriority) {
  if (stock <= 0) {
    return "Stock insuffisant";
  }

  if (!isPaid) {
    return "Paiement requis";
  }

  if (isPriority) {
    return "Commande prioritaire validée";
  }

  return "Commande validée";
}
```

Objectif atteint :

- Couverture > 70%
- Complexité ≤ 10

---

# 📊 Analyse GQM (Goal - Question - Metric)

## 🎯 Goal (Objectif)

Réduire la dette technique et améliorer la maintenabilité de l’API Smart Warehouse.

## ❓ Question

Comment le refactoring et les tests unitaires ont-ils amélioré la qualité du code ?

## 📏 Metrics

| Critère | Avant | Après |
|---|---|---|
| Complexité cyclomatique | Très élevée | ≤ 10 |
| Couverture des tests | 0% | ≥ 70% |
| Dette technique | Importante | Réduite |
| Note SonarCloud | Mauvaise | A |

---

# 🧰 Technologies utilisées

| Technologie | Utilisation |
|---|---|
| Node.js | Backend |
| Jest | Tests unitaires |
| ESLint | Analyse statique |
| SonarCloud | Audit qualité |
| GitHub Actions | CI/CD |
| Git | Versioning |

---

# ✅ Résultats obtenus

- ✔️ Pipeline CI/CD fonctionnel
- ✔️ Détection automatique des anomalies
- ✔️ Réduction de la dette technique
- ✔️ Amélioration de la maintenabilité
- ✔️ Tests automatisés
- ✔️ Qualité logicielle mesurable

---

# 📚 Conclusion

Le projet **Smart Warehouse** démontre l’importance de la qualimétrie dans le développement logiciel moderne.

Grâce à l’intégration des outils CI/CD, des tests automatisés et de l’analyse qualité, l’équipe a pu :

- améliorer la qualité du code,
- réduire les risques,
- automatiser les contrôles,
- garantir une meilleure maintenabilité du projet.

---

# 👨‍🏫 Projet académique

Projet réalisé dans le cadre du :

**TP de Qualimétrie Logicielle — Sujet 10**
