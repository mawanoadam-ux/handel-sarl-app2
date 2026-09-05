# Handel Sarl V2 — réception réelle des demandes

Cette V2 remplace le stockage local de la V1 par une API serveur.

## Ce qui est inclus
- Mini-app mobile-first.
- Formulaire multi-étapes.
- Référence HS-XXXXXX.
- API POST /api/requests.
- Notification e-mail via SMTP vers `handelsa77@gmail.com`.
- Notification WhatsApp optionnelle via WhatsApp Cloud API.
- Endpoint /api/health pour vérifier la configuration.

## Installation
1. Installer Node.js 20+.
2. `npm install`
3. Copier `.env.example` vers `.env`.
4. Renseigner les paramètres SMTP.
5. Pour WhatsApp, renseigner le token Meta, le Phone Number ID et le numéro destinataire.
6. `npm start`
7. Ouvrir `http://localhost:3000`.

## Important
Le serveur ne peut pas envoyer des e-mails réels sans un fournisseur SMTP configuré. La V2 est donc prête pour la production, mais les identifiants du fournisseur doivent être ajoutés par le propriétaire du compte.

Pour un déploiement public, héberger ce dossier sur Render, Railway, VPS ou un autre hébergeur Node.js et définir les variables `.env` dans l'environnement du serveur.
