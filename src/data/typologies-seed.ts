export type SeedTypology = {
  title: string;
  descriptions: string[];
};

export const SEED_TYPOLOGIES: SeedTypology[] = [
  {
    title: "Refund",
    descriptions: [
      "Ce client souhaite annuler un transfert, après identification et présentation, le rep procède au remboursement et en informe le client.",
      "La cliente souhaitait annuler un transfert. Après s'être présentée et avoir procédée à l'identification du client, la rep a effectué le remboursement de la transaction et en a informé le cliente. Elle lui a également indiqué qu'elle avait la possibilité d'annuler lui-même ce type de transaction à l'avenir. Une fois la demande traitée et les informations nécessaires communiquées, la rep a pris congé du client.",
      "Cette cliente a effectué un transfert par erreur, après identification, présentation et vérification, la rep lui informe que les fonds ont déjà été utilisés.",
      "La rep n'a pas effectué le remboursement alors qu'il devait le faire conformément au process en vigueur.",
      "Le fait que la rep n'ait pas pris en charge la demande du client est susceptible d'entraîner une réitération de celui-ci. En l'absence de traitement, le client sera amené à recontacter le service, ce qui impacte à la fois son expérience et la charge opérationnelle. Il est donc essentiel de traiter la demande dès le premier contact, conformément au process actuel.",
      "Le rep n'a pas effectué le remboursement alors que le process en vigueur l'autorisait et le prévoyait. Cette omission constitue un écart par rapport aux procédures établies et a empêché le client de bénéficier d'une résolution conforme et rapide de sa demande.",
    ],
  },
  {
    title: "Recover PIN",
    descriptions: [
      "Cette cliente (app user) oublie son code secret et souhaite définir un nouveau pour son compte, après identification et présentation, le rep procède à certaines vérifications, lui fait un reset pin et valide sa compréhension avant de prendre congé.",
    ],
  },
  {
    title: "Reset PIN",
    descriptions: [
      "Cette cliente (app user) oublie son code secret et souhaite définir un nouveau pour son compte, après identification et présentation, le rep procède à certaines vérifications, lui fait un reset pin et valide sa compréhension avant de prendre congé.",
    ],
  },
  {
    title: "Forget QR",
    descriptions: [
      "Cette cliente a perdu sa carte et souhaite qu'elle soit détachée de son compte, après identification et présentation, la rep fait un forget QR et lui demande de se rendre dans un point Wave afin d'obtenir une nouvelle carte.",
      "Ce client souhaite que sa carte soit détachée de son compte, après identification et présentation, le rep fait un forget QR et lui demande de se rendre dans un point Wave afin d'obtenir une nouvelle carte.",
    ],
  },
  {
    title: "Device Restriction",
    descriptions: [
      "Ce client a un nouveau téléphone et souhaite lever la restriction qu'il avait activée sur son ancien appareil. Après identification et présentation, la rep lève la restriction et lui demande de se reconnecter.",
      "Ce client rencontre un souci pour connecter son compte sur son appareil et souhaite avoir assistance, après identification et présentation, la rep explique la raison du blocage puis lève la restriction à la demande du client (change device/disable feature) avant de prendre congé.",
      "Ce client avait activé une restriction. Il a désinstallé puis réinstallé l'application Wave et souhaite que la restriction soit levée. Après identification et présentation, la rep a levé la restriction et lui a demandé de se reconnecter avant de prendre congé.",
    ],
  },
  {
    title: "Lost Phone",
    descriptions: [
      "Le client a perdu son téléphone et souhaite sécuriser son compte. Après identification, la rep procède à la sécurisation du compte et invite le client à récupérer son numéro, puis à nous recontacter afin de permettre une prise en charge.",
    ],
  },
  {
    title: "Security Challenge",
    descriptions: [
      "Cette cliente rencontre un problème pour effectuer certaines transactions en raison d'un security challenge. Après identification et présentation, la rep explique les raisons du blocage. Elle procède ensuite aux vérifications nécessaires avant de lever le blocage.",
    ],
  },
  {
    title: "Vault",
    descriptions: [
      "Ce client souhaite débloquer son coffre, après identification et présentation, la rep l'informe que si elle débloque le coffre, il lui sera impossible de le bloquer une nouvelle fois avant le mois prochain, le client confirme vouloir débloquer son coffre, la rep procède au déblocage.",
    ],
  },
  {
    title: "B2W",
    descriptions: [
      "Le client a changé de téléphone et nous contacte pour lier ses comptes (B2W). Après identification et présentation, le rep s'assure que le client est en possession de sa CNI et transfère l'appel au Back Office pour une meilleure prise en charge.",
    ],
  },
  {
    title: "Minor Request",
    descriptions: [
      "Ce client, étant mineur, rencontrait un souci pour effectuer une transaction. Après une identification, une présentation et les vérifications nécessaires, la rep lui a expliqué qu'une autorisation parentale était requise pour réaliser certaines transactions. Elle lui a ensuite envoyé le lien correspondant, lui a clairement détaillé les étapes à suivre, puis a pris congé de manière appropriée.",
    ],
  },
  {
    title: "Turn",
    descriptions: [
      "Cette cliente, expéditeur d'un transfert nous avait contactés pour refund, la transaction était gelée pour des vérifications, elle nous recontacte pour que ces fonds soient retournés à son destinataire, après une bonne identification et présentation, le fo rep transfère l'appel au Back pour une meilleure prise en charge.",
      "Cette cliente, expéditeur d'un transfert nous avait contactés pour refund, la transaction était gelée pour des vérifications, elle nous recontacte pour que ces fonds soient retournés à son destinataire.",
    ],
  },
  {
    title: "Terminate Account",
    descriptions: [
      "Le client souhaite clôturer le compte rattaché à son numéro afin d'ouvrir un nouveau compte. Après identification et présentation, la rep laisse une note, puis transfère l'appel au #1 pour assistance.",
    ],
  },
  {
    title: "Rebalance",
    descriptions: [
      "Cet agent souhaite un rééquilibrage. Après identification et présentation, le rep fait la remontée et l'informe de patienter le temps que l'équipe habilitée s'en occupe.",
    ],
  },
  {
    title: "SMS Code",
    descriptions: [
      "Le client souhaite effectuer un retrait, mais ne reçoit pas son code de validation. Après identification et vérification, le rep lui communique son code SMS avant de prendre congé.",
    ],
  },
];
