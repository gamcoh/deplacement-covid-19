# Générateur de certificat de déplacement

## Utiliser
### Installer le projet
```console
$ git clone https://github.com/gamcoh/deplacement-covid-19.git
$ cd deplacement-covid-19
$ npm install
```

### Utiliser une fois
Pour l'utiliser qu'une fois de temps en temps, lancez cette commande :
```console
$ npm run build
```
Si c'est la première fois que vous lancez cette commande l'authentification Google Drive vous sera demandée, suivez les instructions dans la console.

### Utiliser tous les matins
Pour générer un certificat tous les jours, il suffit de créer une `crontab` :
```console
$ crontab -e
0 1 * * 1-5 cd /path/to/deplacement-covid-19 && npm run build
```
Cette `crontab` s'exécutera à 1h du matin du lundi au vendredi.

## Développer

### Installer le projet
```console
$ git clone https://github.com/gamcoh/deplacement-covid-19.git
$ cd deplacement-covid-19
$ npm install
```

## Crédits

Ce projet a été réalisé à partir d'un fork du dépôt [deplacement-covid-19](https://github.com/LAB-MI/deplacement-covid-19) de [LAB-MI](https://github.com/LAB-MI).

Les projets open source suivants ont été utilisés pour le développement de ce 
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/license)
