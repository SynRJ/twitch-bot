const ctbPhrases = [
  'Elle est énorme cette file d\'attente...',
  'J\'adore cette musique, même si elle est un peu longue...',
  'L\'océan, ça sent quand même un peu la mer...',
  'Cette sauce a une longueur en bouche intéressante...',
  'C\'est dommage que ce roman soit si court...',
  'Mais il est tout petit ce canari...',
  'Ce broccoli a vraiment un sale goût...',
  'Je vais avaler cette glace d\'un coup...',
  'Ce film était très bien, mais un peu court...',
  'Ça sent le poisson pourri cette histoire...',
  'La carte est immense...',
  'Ce chaton est vraiment trop mignon...',
  'Il arrive toujours par derrière cet ennemi...',
  'La souris peut largement passer par ce minuscule trou...',
  'Je pense que ça peut passer...',
  'Même en forçant, ça passera jamais...',
  'Il est pas beau ce portail...',
  'Il est magnifique ce lampadaire...',
  'Ce repas m\'a laissé une sensation merveilleuse dans la bouche...',
  'Elle est amère, cette bière...',
  'Cette étoffe est douce et soyeuse...',
  'Il faudrait qu\'elle prenne l\'air plus souvent...',
  'Ça sent le renfermé...',
  'Cette fleur émet un parfum floral...',
  'Jouer à ce jeu ne me procure plus aucun plaisir...',
  'Jardiner me procure énormément de plaisir...',
  'Ces paysages sont très impressionnants...',
  'Il a un égo surdimensionné...',
  'Cette soupe est très goûtue...',
  'Le Grand Canyon est colossal...',
  'Elle a les chevilles qui enflent...',
  'Vis à vis de la situation, c\'était une réaction démesurée...',
  'Cette cathédrale est monumentale...',
  'Ce château est immense et somptueux...',
  'Les bactéries sont microscopiques...',
  'Les microbes ne sont pas visibles à l\'oeil nu...',
  'Ce concombre est tout rabougri, il fait peine à voir...',
  'Ce fichier est volumineux...',
  'Ce vase de l\'époque Ming a une valeur inestimable...',
  'Cette histoire est tout bonnement incroyable...',
  'Il en faut peu pour être heureux...',
  'J\'ai hâte qu\'elle s\'en aille...',
  'Elle a grandi si vite...',
  'Cet homme est très petit, mais très sage...',
  'Ce mécanisme est rudement efficace...',
  'A ce jour, l\'épave de la Cordelière reste introuvable...',
  'Ça fait un bail qu\'on ne l\'a plus aperçue...',
  'Il y a longtemps qu\'elle n\'est plus sortie de chez elle...',
  'Cet exercice est beaucoup trop dur pour moi...',
  'Ce gâteau est ferme et fondant...',
  'Il a des muscles saillants et fermes...',
  'Habillé comme ça, il a vraiment l\'air ridicule...',
  'Cet arbre se dresse majestueusement au milieu de l\'allée...',
  'La statue a été érigée en l\'honneur de son père...',
  'Ce joueur possède une agilité exceptionnelle...',
  'Cette joueuse dipose d\'une endurance à toute épreuve...',
  'Malheureusement, elle n\'a pas la bonne taille...',
  'Il est beaucoup trop petit pour elle...',
  'Elle est beaucoup trop grande pour lui...',
  'Jamais elle ne reverra la lumière du jour...',
  'Son goût est subtil et délicat...',
  'Le parfum de cet homme est écoeurant...',
  'J\'aimerai bien la voir en vrai, un jour...',
  'Elle a connu des jours meilleurs...',
  'C\'est tellement bon qu\'on en mangerait...',
  'Un tien vaut mieux que deux tu l\'auras...',
  'Pour un fruit aussi coloré, c\'est vraiment très fade...',
  'Ce plat a une sucrosité intéressante...',
  'Cette viande est vraiment tendre à souhaite...',
  'Sa voix est douce et voluptueuse...',
  'Sa voix est suave et envoûtante...',
  'Sa voix est ferme et rocailleuse...',
  'Le chocolat a fondu dans ses mains...',
  'Ce blanc de poulet fond en bouche...',
  'Il est parti en me laissant une sensation désagréable...',
  'Cette idée m\'emplit de joie et d\'allégresse...',
  'Son regard me remplit de tristesse et d\'amertume...',
  'La route est longue et sinueuse...',
  'Elle me va comme un gant, cette couleur...',
  'Décidemment, on arrivera jamais à faire rentrer le piano dans le camion...',
  'L\'escalier est trop étroit, ça ne passera jamais...',
  'Le tapis est resté dehors toute la nuit, il est très rigide et très froid...',
  'Si tu veux survivre, il faut t\'endurcir...',
  'Elle a un caractère bien trempé...',
  'Cet homme dégage une aura malveillante...',
  'C\'est vraiment très tentant...',
  'Ce n\'est pas tentant du tout...',
];

const commandCategories = {
  TEXT:'text',
  SFX:'sfx',
  MOD:'moderation',
  MISC:'misc'
};

const modCommands = [
  '!killsfx',
  '!killsfxq'
];

const timerPhrases = [
  "Envie de voir ou revoir des clips, avoir les dernières infos sur la chaîne ou simplement discuter ? Rejoins le discord : https://discord.gg/PaZbKcX !",
  "Retrouve les dernières VODs et best-oeufs sur la chaîne youtube : https://www.youtube.com/channel/UCn_cu9jENWmF2IA5Rj3DoEQ/ !",
  // "🐮 Le troisième Best Œuf est déjà là https://youtu.be/gzK892UCp2s 🐧 Merci à tous pour vos clips et n'hésitez pas à clip les moments du live qui vous plaisent 😘"
];

const killSFXPhrases = [
  "a pulverisé le SFX. De rien.",
  "a exterminé le SFX. De rien.",
  "a détruit le SFX. De rien.",
  "a explosé le SFX. De rien.",
  "a abattu le SFX. De rien.",
  "a écrasé le SFX. De rien.",
  "a écrabouillé le SFX. De rien.",
  "a anéanti le SFX. De rien.",
  "a désagrégé le SFX. De rien.",
  "a déchiqueté le SFX. De rien.",
  "a bousillé le SFX. De rien.",
  "a foudroyé le SFX. De rien.",
  "a vaporisé le SFX. De rien."
];

const killQueuePhrases = [
  "a exterminé la file d'attente des SFX. De rien.",
  "a pulverisé la file d'attente des SFX. De rien.",
  "a détruit la file d'attente des SFX. De rien.",
  "a explosé la file d'attente des SFX. De rien.",
  "a abattu la file d'attente des SFX. De rien.",
  "a écrasé la file d'attente des SFX. De rien.",
  "a écrabouillé la file d'attente des SFX. De rien.",
  "a anéanti la file d'attente des SFX. De rien.",
  "a désagrégé la file d'attente des SFX. De rien.",
  "a déchiqueté la file d'attente des SFX. De rien.",
  "a bousillé la file d'attente des SFX. De rien.",
  "a foudroyé la file d'attente des SFX. De rien.",
  "a vaporisé la file d'attente des SFX. De rien."
];

const connectPhrases = [
  "fait une entrée fracassante.",
  "débarque en grande pompe.",
  "arrive les doigts de pied en éventail.",
  "se connecte, prêt à en découdre.",
  "Beep bop boop. Je suis un robot.",
  "n'est jamais en retard, ni en avance d'ailleurs. Il arrive précisemment à l'heure prévue.",
  "pose ses valises dans le tchat.",
  "arrive en ville. Changez de trottoir.",
  "fait une entrée remarquée.",
  "débarque virilement dans le tchat.",
  "arrive comme un cheveu sur la soupe.",
  "se glisse discrètement dans le tchat. Circulez, y a rien à voir.",
  "roule des mécaniques. Brrr",
];

const beepboopPhrases = [
  "Beep boop",
  "Bop beep boop",
  "Beep beep burp",
  "Bleep boop",
  "Beep beep boop",
  "Boop bleep",
  "Beep bleep boop",
  "Beep boop boop",
  "Boop beep boop",
  "BOOP BEEP BOOP",
  "BEEP BEEP BOOP",
  "BOOP BEEP",
  "BEEP BOOP",
  "BOOP BLEEP BOOP",
  "BEEP BOOP BEEP",
];

const botPhrases = [
  "fixe intensément $user.",
  "approuve ce que dit $user.",
  "ne semble pas approuver ce que dit $user.",
  "n'est pas d'accord avec $user.",
  "observe attentivement $user.",
  "regarde $user d'un air réprobateur.",
  "ne dit rien, mais n'en pense pas moins.",
  "s'en lave les mains, mais d'une force...",
  "ne croit pas une seule seconde aux bobards de $user.",
  "n'y voit pas d'inconvénient.",
  "commence à fumer de manière excessive.",
  "aurait bien besoin d'un peu d'huile de moteur.",
  "regarde $user de haut (c'est un grand robot).",
  "se ferait bien une omelette. OU PAS !",
  "est toujours prêt pour la bagarre. Méfie-toi $user...",
];

const bots = [
  "synrj",
  "streamlabs",
  "jeffecorga",
  "lurxx",
  "jeanrnestu",
  "wizebot"
];

module.exports = {
  ctbPhrases,
  timerPhrases,
  killQueuePhrases,
  killSFXPhrases,
  connectPhrases,
  botPhrases,
  beepboopPhrases,
  modCommands,
  bots,
  commandCategories
};