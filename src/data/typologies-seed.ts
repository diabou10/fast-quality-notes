export type SeedDescription = { kind: "pass" | "fail"; text: string };

export type SeedTypology = {
  title: string;
  descriptions: SeedDescription[];
};

export const SEED_TYPOLOGIES: SeedTypology[] = [
  {
    "title": "Refund",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Ce client souhaite annuler un transfert, après identification et présentation, le rep procède au remboursement et en informe le client."
      },
      {
        "kind": "pass",
        "text": "Cette cliente a effectué un transfert par erreur, après identification, présentation et vérification, la rep lui informe que les fonds ont déjà été utilisés et prend congé."
      },
      {
        "kind": "pass",
        "text": "La cliente souhaitait annuler un transfert. Après s’être présentée et avoir procédée à l’identification du client, la rep a effectué le remboursement de la transaction et en a informé le cliente. Elle lui a également indiqué qu’elle avait la possibilité d’annuler lui-même ce type de transaction à l’avenir. Une fois la demande traitée et les informations nécessaires communiquées, la rep a pris congé du client."
      },
      {
        "kind": "pass",
        "text": "Cette cliente a effectué un transfert par erreur, après identification, présentation et vérification, la rep lui informe que les fonds ont déjà été utilisés."
      },
      {
        "kind": "pass",
        "text": "Après avoir effectué le remboursement, veillez à informer le client qu'il dispose également de la possibilité d'annuler lui-même ce type de transaction via WhatsApp."
      },
      {
        "kind": "pass",
        "text": "Le client souhaitait annuler un transfert. Après s’être présenté et avoir procédé à l’identification du client, le rep a effectué le remboursement de la transaction et en a informé le client. Il lui a également indiqué qu’il avait la possibilité d’annuler lui-même ce type de transaction à l’avenir. Une fois la demande traitée et les informations nécessaires communiquées, le rep a pris congé du client."
      }
    ]
  },
  {
    "title": "Recover Pin",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente oublie son code secret et nous contacte pour un Recover pin, après une bonne identification et présentation, le rep procède aux vérifications, réinitialise le code et lui dicte les instructions à suivre."
      },
      {
        "kind": "pass",
        "text": "Le client rencontre un souci pour accéder à son compte Wave, après identification conforme et présentation, le rep procède aux vérifications avant de réinitialiser le code secret."
      },
      {
        "kind": "fail",
        "text": "Il est important de toujours sensibiliser le client lors du choix de son code secret, en lui rappelant de choisir un code sécurisé, difficile à deviner, et de ne le communiquer à personne. Cette étape contribue à la protection de son compte et à la prévention des risques de fraude."
      },
      {
        "kind": "fail",
        "text": "Il est important d’informer le client qu’il aura besoin d’une connexion Internet pour définir un nouveau code secret. Cette précision lui permet de s’assurer qu’il dispose des conditions nécessaires pour finaliser la procédure et éviter les réitérations."
      },
      {
        "kind": "fail",
        "text": "Omission d'informations essentielles : Le délai de 10 minutes pour définir le nouveau code secret ainsi que la nécessité d'une connexion Internet n'ont pas été communiqués au client. Cette omission augmente le risque de réitération, le client pouvant ne pas être en mesure de finaliser la procédure lors de cette prise en charge."
      }
    ]
  },
  {
    "title": "Reset Pin",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente (app user) oublie son code secret et souhaite définir un nouveau pour son compte, après identification et présentation, le rep procède à certaines vérifications, lui fait un reset pin et valide sa compréhension avant de prendre congé."
      }
    ]
  },
  {
    "title": "Forget Qr",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente a perdu sa carte et souhaite qu'elle soit détachée de son compte, après identification et présentation, la rep fait un forget QR et lui demande de se rendre dans un point Wave afin d'obtenir une nouvelle carte."
      },
      {
        "kind": "pass",
        "text": "Ce client souhaite que sa carte soit détachée de son compte, après identification et présentation, le rep fait un forget QR et lui demande de se rendre dans un point Wave afin d'obtenir une nouvelle carte."
      },
      {
        "kind": "fail",
        "text": "Il faut toujours demander au client s’il se souvient de son code secret et l’assister pour un reset PIN dans le cas où il ne s’en souvient pas."
      }
    ]
  },
  {
    "title": "Device Restriction",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente a un nouveau téléphone et souhaite lever la restriction qu’elle avait activée sur son ancien appareil. Après identification et présentation, le rep explique la raison du blocage et lève la restriction (diseable feature) à la demande du client avant de prendre congé."
      },
      {
        "kind": "pass",
        "text": "Ce client avait activé une restriction. Il a désinstallé puis réinstallé l’application Wave et souhaite que la restriction soit levée. Après identification et présentation, le rep a levé la restriction."
      },
      {
        "kind": "pass",
        "text": "Ce client rencontre un souci pour connecter son compte sur son appareil et souhaite avoir assistance, après identification et présentation, la rep explique la raison du blocage puis lève la restriction à la demande du client (change device) avant de prendre congé."
      },
      {
        "kind": "pass",
        "text": "Ce client a un nouveau téléphone et souhaite lever la restriction qu'il avait activée sur son ancien appareil. Après identification et présentation, la rep lève la restriction et lui demande de se reconnecter."
      },
      {
        "kind": "fail",
        "text": "Pour lever la restriction, il est nécessaire de demander au client s’il souhaite effectuer un changement d’appareil ou une désactivation de la fonctionnalité avant toute action. Merci de respecter le process tel qu’édicté."
      }
    ]
  },
  {
    "title": "Lost Phone",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Le client a perdu son téléphone et souhaite sécuriser son compte. Après identification, la rep procède à la sécurisation du compte et invite le client à récupérer son numéro, puis à nous recontacter afin de permettre une prise en charge."
      },
      {
        "kind": "fail",
        "text": "Après la sécurisation du compte, il est nécessaire d’informer le client que le déblocage ne pourra intervenir qu’après un délai de 2 heures."
      }
    ]
  },
  {
    "title": "Security Challenge",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente rencontre un problème pour effectuer certaines transactions en raison d’un security challenge. Après identification et présentation, la rep lui explique les raisons du blocage. Elle procède ensuite aux vérifications nécessaires avant de lever le blocage"
      }
    ]
  },
  {
    "title": "Vault",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Ce client souhaite débloquer son coffre, après identification et présentation, la rep l'informe que si elle débloque le coffre, il lui sera impossible de le bloquer une nouvelle fois avant le mois prochain, le client confirme vouloir débloquer son coffre, la rep procède au déblocage."
      },
      {
        "kind": "pass",
        "text": "Cette cliente souhaite débloquer son coffre, après identification et présentation, le rep l'informe que s'il débloque le coffre, il lui sera impossible de le bloquer une nouvelle fois avant le mois prochain, la cliente confirme vouloir débloquer son coffre, le rep procède au déblocage."
      },
      {
        "kind": "pass",
        "text": "Le client souhaite un move vault balance, le Fo rep, ne disposant pas les accès pour traiter cette demande, transfère l'appel pour une meilleure assistance."
      },
      {
        "kind": "pass",
        "text": "Ce client souhaite déplacer ses fonds de son coffre vers son compte principal, après identification, la rep transfère l'appel au #1 pour une assistance."
      },
      {
        "kind": "fail",
        "text": "Avant de débloquer le coffre du client, il est impératif de l'informer qu'une fois le coffre débloqué, il ne pourra plus le rebloquer avant le mois suivant, puis de recueillir son accord avant de procéder à l'action."
      }
    ]
  },
  {
    "title": "B2W",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Le client a changé de téléphone et nous contacte pour lier ses comptes (B2W). Après identification et présentation, le rep s'assure que le client est en possession de sa CNI et transfère l'appel au Back Office pour une prise en charge."
      },
      {
        "kind": "pass",
        "text": "Cette cliente a réinitialisé son téléphone et nous contacte pour lier ses comptes (B2W), la rep s'assure que le client est en possession de sa CNI et transfère l'appel au Back Office pour une prise en charge."
      },
      {
        "kind": "pass",
        "text": "Cette cliente souhaite lier ses comptes, le fo rep ne disposant pas les accès pouvant traiter cette requête, transfère l'appel au #1 pour une assistance."
      }
    ]
  },
  {
    "title": "Minor Request",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Ce client, étant mineur, rencontrait un souci pour effectuer un envoi. Après une présentation, une identification et les vérifications nécessaires, la rep lui a expliqué qu’une autorisation parentale était requise pour réaliser certaines transactions. Elle lui a ensuite envoyé le lien correspondant, lui a clairement détaillé les étapes à suivre, puis a pris congé de manière appropriée."
      },
      {
        "kind": "pass",
        "text": "Le client a bien reçu le lien lui permettant d’obtenir une autorisation parentale et suivra les étapes nécessaires à l’issue de l’appel."
      },
      {
        "kind": "fail",
        "text": "Il est impératif d'informer le client que la personne qui lui accordera l'autorisation parentale doit être âgée d'au moins 18 ans, disposer d'un compte en statut KYC 2 et être utilisatrice de l'application tout en y étant connectée au moment de la procédure."
      },
      {
        "kind": "fail",
        "text": "L'omission des conditions d'éligibilité du garant (être âgé d'au moins 18 ans, disposer d'un compte en statut KYC2 et être connecté à l'application Wave) est susceptible d'entraîner une réitération, le client pouvant ne pas être en mesure de finaliser la procédure d'autorisation parentale."
      }
    ]
  },
  {
    "title": "Turn Frozen",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cette cliente, expéditeur d'un transfert nous avait contactés pour refund, la transaction était gelée pour des vérifications, elle nous recontacte pour que ces fonds soient retournés à son destinataire, après une bonne identification et présenation, le fo rep transfère l'appel au Back pour une meilleure prise en charge."
      },
      {
        "kind": "pass",
        "text": "Ce client a reçu un transfert dont l’expéditeur a demandé l’annulation, il souhaite que les fonds lui soient restitués, après identification et présentation, la rep traite de sa demande et prend congé."
      }
    ]
  },
  {
    "title": "Rebalance",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Cet agent souhaite un rééquilibrage. Après identification et présentation, le rep fait la remontée et l’informe de patienter le temps que l’équipe habilitée s’en occupe."
      },
      {
        "kind": "pass",
        "text": "Le Fo rep, n'ayant pas les accès pour faire le rééquilibrage, fait la remontée pour une prise en charge."
      }
    ]
  },
  {
    "title": "Kyc Limit",
    "descriptions": [
      {
        "kind": "pass",
        "text": "La cliente rencontre un souci pour recevoir des fonds. Après identification et présentation, le rep a vérifié son plafond et l’a informée que son compte était plafonné. Il l’a ensuite invitée à se rendre dans un point Wave afin de procéder au déplafonnement."
      },
      {
        "kind": "pass",
        "text": "Le client souhaitait obtenir des informations sur la limite de son compte. Après identification et présentation, le rep a vérifié son plafond, l’a informé du montant qu’il était en mesure de recevoir et l’a invité à procéder au déplafonnement depuis les paramètres de son application avant de prendre congé."
      },
      {
        "kind": "pass",
        "text": "Le client a appelé suite à une information de son expéditeur indiquant que son compte serait plafonné. Après identification, présentation et vérifications d’usage, le rep l’a informé que son compte n’était pas plafonné. Il a ensuite validé la bonne compréhension du client avant de prendre congé."
      }
    ]
  },
  {
    "title": "E-Kyc",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Après avoir rejeté la pièce du client, il est impératif de l’inviter à déplafonner son compte depuis les paramètres de son application (E-KYC)."
      }
    ]
  },
  {
    "title": "Rename User",
    "descriptions": [
      {
        "kind": "fail",
        "text": "S'il y'a incohérence entre les deux noms qui figurent sur le compte, il faut procéder au rename user pour asurer la conformité."
      }
    ]
  },
  {
    "title": "Business Process Adherence",
    "descriptions": [
      {
        "kind": "fail",
        "text": "Sur cet entretien, on constate que le rep ne s’est pas présenté. Cette omission nuit à la qualité de l’accueil, la présentation est une étape essentielle dès le début de l’échange. Merci d'en tenir compte lors de tes prochains entretiens."
      },
      {
        "kind": "fail",
        "text": "Il est impératif de remercier le client après l’avoir mis en attente, ce simple geste renforce la qualité de l’expérience client."
      },
      {
        "kind": "fail",
        "text": "Il a été constaté que la prise de congé n'est pas doublement nominative. Je t'invite à nommer le client et Wave lors de tes prochains entretiens."
      },
      {
        "kind": "fail",
        "text": "Une absence de closing a été constaté sur cet entretien. Il est donc essentiel de toujours inclure un closing structuré pour s’assurer que le client repart avec toutes les informations nécessaires et que l’appel se termine de manière claire et professionnelle."
      },
      {
        "kind": "fail",
        "text": "Le rep n’a pas validé la compréhension du client avant de prendre congé. Il est important de s’assurer que les informations communiquées sont claires et que le client a obtenu une réponse à sa demande avant de clôturer l’échange."
      }
    ]
  },
  {
    "title": "Move Balance",
    "descriptions": [
      {
        "kind": "pass",
        "text": "Ce client souhaite un move balance, car il a perdu un numéro qu'il ne peut plus récupérer, le rep l'identifie, se présente, recueille le numéro perdu et transfère son appel au #1 pour une prise en charge."
      },
      {
        "kind": "pass",
        "text": "Cette cliente souhaite un move balance, le FO rep, ne disposant pas les accès lui permettant de traiter cette requête, transfère l'appel au back office pour une meilleure assistance."
      },
      {
        "kind": "pass",
        "text": "Pour les clients KYC 1, avant de transférer l’appel, il est impératif de vérifier si le numéro perdu a été déplafonné. Si c'est bien le cas, inviter le client à identifier son compte avant de nous rappeler afin d’assurer une meilleure prise en charge."
      }
    ]
  }
];
