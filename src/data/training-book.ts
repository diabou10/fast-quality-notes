/**
 * Base de connaissances extraite du "New Front Office SN Support Training Book".
 * Chaque section sert de justification (référence process) pour un commentaire.
 */

export type TrainingSection = {
  id: string;
  title: string;
  page: string;
  keywords: string[];
  excerpt: string;
};

export const TRAINING_SECTIONS: TrainingSection[] = [
  {
    id: "refund-prerequis",
    title: "Refund — Prérequis",
    page: "p. 71",
    keywords: ["refund", "annuler un transfert", "remboursement", "rembourser", "transfert par erreur"],
    excerpt:
      "Prérequis : Identification (Nom - prénom) ; s'assurer que le client nous appelle avec le numéro concerné ; valider le montant de la transaction ; s'assurer que les fonds à annuler sont disponibles ou ne sont pas utilisés en partie.",
  },
  {
    id: "refund-integral",
    title: "Refund intégral — information WhatsApp",
    page: "p. 72",
    keywords: ["refund", "remboursement", "whatsapp", "annuler lui-même", "annuler soi-meme", "flag vert"],
    excerpt:
      "Flag vert : on fait le Refund intégral, la totalité des fonds est retournée au sender. PS : une fois le refund effectué, le rep devra informer le client que cette procédure peut désormais être traitée directement via WhatsApp, puis lui indiquer le parcours à suivre via les paramètres de l'appli.",
  },
  {
    id: "refund-partiel",
    title: "Refund partiel — accord verbal obligatoire",
    page: "p. 73",
    keywords: ["refund partiel", "fonds utilisés", "fonds ont déjà été utilisés", "accord", "flag jaune"],
    excerpt:
      "Flag jaune (24 h) : les fonds envoyés ont été utilisés en partie, 70 % restent disponibles. Avant de cliquer sur « Continue refund and freeze funds », il faut toujours avoir l'accord verbal du client. S'il n'est pas d'accord, on l'invite à appeler le recipient et on laisse une note sur Front.",
  },
  {
    id: "refund-impossible",
    title: "Refund impossible — fonds indisponibles",
    page: "p. 75",
    keywords: ["fonds ne sont plus disponibles", "fonds ont déjà été utilisés", "refund impossible", "flag rouge"],
    excerpt:
      "Flag rouge : le refund est impossible. On informe le client que les fonds ne sont plus disponibles et on l'invite à appeler directement le Recipient. On laisse une note sur Front pour codifier la fiche.",
  },
  {
    id: "refund-verification",
    title: "Refund verification (48 h)",
    page: "p. 74 & 77-79",
    keywords: ["refund verification", "vérification", "48h", "scan", "haut risque", "gelée", "gelés"],
    excerpt:
      "Flag jaune avec délai de 48 h : transfert effectué par scan ou risque détecté. On informe le client que des vérifications sont nécessaires avant le refund et on l'invite à patienter 48 h, ou le Recipient nous appelle pour confirmer l'annulation. Dans les 48 h, si le Recipient confirme : utiliser « Turn Frozen Funds Into Reversal ».",
  },
  {
    id: "turn-frozen",
    title: "Turn Frozen Funds Into Reversal",
    page: "p. 87-98",
    keywords: ["turn frozen", "frozen", "fonds gelés", "gelée", "reversal", "retournés", "restitués", "back office"],
    excerpt:
      "Le Front Office peut déplacer des fonds gelés via le bouton « TURN FROZEN FUNDS INTO REVERSAL ». Pour tous les cas de figure, il est impératif que le client qui détient les fonds gelés dans son compte nous appelle obligatoirement : c'est ce qui rend le bouton disponible. Sinon, transfert vers le BO.",
  },
  {
    id: "recover-reset-def",
    title: "Recover / Reset PIN — définitions",
    page: "p. 35",
    keywords: ["recover pin", "reset pin", "code secret", "app user", "carte", "ussd"],
    excerpt:
      "Recover PIN : pour les clients qui utilisent l'application Wave (App User). Reset PIN : pour les clients qui utilisent la carte ou souhaitent utiliser le code USSD. NB : pour des raisons de sécurité, ne pas choisir un code simple (1234, 0000, date de naissance, chiffres du numéro de téléphone).",
  },
  {
    id: "recover-prerequis",
    title: "Recover / Reset PIN — prérequis & questions de sécurité",
    page: "p. 36-40",
    keywords: ["recover", "reset", "code secret", "vérifications", "questions de sécurité", "identification"],
    excerpt:
      "Avant d'entamer les questions de sécurité, il faut toujours : demander le nom et prénom du client, lui demander le numéro concerné, et le préparer au questionnement (« Pour mieux vous assister à définir un nouveau code secret, merci de répondre à certaines questions relatives à votre compte »).",
  },
  {
    id: "recover-attention",
    title: "Point d'attention — Recovery PIN (10 min & Internet)",
    page: "p. 43",
    keywords: [
      "10 minutes",
      "connexion internet",
      "réitération",
      "reiteration",
      "nouveau code secret",
      "instructions",
      "recover",
    ],
    excerpt:
      "Il est obligatoire d'expliquer clairement les étapes à suivre et d'informer le client qu'il dispose d'un délai de 10 minutes pour réinitialiser son code et qu'une connexion Internet sera nécessaire pour finaliser la procédure (annoncer les 10 minutes avant de cliquer sur Recover). Si le client ne peut pas faire le process lui-même, le rep doit l'assister jusqu'à la connexion.",
  },
  {
    id: "clear-pin-block",
    title: "Clear PIN block (remove login rate limit)",
    page: "p. 44-45",
    keywords: ["clear pin block", "tentatives", "bloqué", "login rate limit", "accéder à son compte"],
    excerpt:
      "Le clear pin block annule le temps d'attente après plusieurs mauvaises saisies du code. Procéder à l'identification (nom - prénom), puis cliquer sur « clear pin block » SI ET SEULEMENT SI le client n'a pas oublié son code secret. S'il ne s'en souvient plus, suivre le process du Recovery PIN.",
  },
  {
    id: "forget-qr",
    title: "Forget QR — process",
    page: "p. 65-66",
    keywords: ["forget qr", "carte", "détachée", "detacher", "point wave", "qr"],
    excerpt:
      "Le Forget QR consiste à détacher une carte QR d'un compte client : identification, s'assurer que le client appelle avec le numéro concerné, procéder au Forget QR, puis vérifier si le client a un code secret. S'il s'en souvient : prendre congé après l'avoir invité à se rendre dans un point Wave pour une nouvelle carte gratuitement. Sinon : procéder au Recover/Reset PIN avant de l'inviter au point Wave.",
  },
  {
    id: "lost-phone",
    title: "Block User by mobile — téléphone perdu/volé",
    page: "p. 171-173",
    keywords: ["perdu son téléphone", "lost phone", "sécuriser son compte", "blocage", "2 heures", "vol"],
    excerpt:
      "Après vol/perte, le premier réflexe du rep est, après identification, de bloquer le compte (More => Block User by Mobile => Lost Phone/SIM). NB : il est impératif d'informer le client qu'un délai de 2 heures est requis avant tout déblocage, et de l'inviter à noter le numéro d'appel utilisé pour le blocage. Ensuite : date de perte, solde, vérification des transactions sortantes.",
  },
  {
    id: "move-balance",
    title: "Move Balance — conditions et remontée",
    page: "p. 176-177",
    keywords: ["move balance", "numéro perdu", "carte sim", "transfère l'appel", "back office", "#1"],
    excerpt:
      "Le Move permet aux Reps BO de déplacer des fonds d'un compte A vers un compte B (même propriétaire), en dernier recours : carte SIM perdue et non récupérable, Payout 1xbet sur un numéro non détenu, etc. Sur Front, le FO laisse une note, invite le client à rester en ligne et transfère l'appel vers le BO, avec le format de remontée (What / From / To / Reason / Amount).",
  },
  {
    id: "kyc-limits",
    title: "KYC — plafonds et cumuls",
    page: "p. 8-9",
    keywords: ["kyc", "plafond", "plafonné", "limite", "recevoir des fonds", "cumul"],
    excerpt:
      "KYC1 : aucune pièce soumise, wallet limité à 200 000 CFA. KYC2 : pièce soumise, wallet 2 000 000 CFA et cumul mensuel de 10 000 000 CFA (dépôts + réceptions), restauré le 1er du mois. Sur Front : More → Calculate limit pour vérifier la limite restante.",
  },
  {
    id: "deplafonnement",
    title: "Déplafonnement & e-KYC",
    page: "p. 10-12",
    keywords: ["déplafonnement", "deplafonner", "e-kyc", "ekyc", "paramètres", "point wave", "cni"],
    excerpt:
      "Le déplafonnement permet de passer en KYC2 : soit directement depuis l'application (e-KYC : Paramètres → Check Limit → Increase your limit), soit en se rendant dans un point Wave avec la CNI. Points de vigilance : 5 tentatives e-KYC maximum, au-delà le client doit voir un agent ; en cas de rejet, le client reste KYC1 et doit réessayer ou voir un agent.",
  },
  {
    id: "id-review",
    title: "ID Review — points de contrôle",
    page: "p. 14",
    keywords: ["id review", "pièce", "rejeter", "document", "cni", "e-kyc"],
    excerpt:
      "Documents acceptés : CNI valide (CEDEAO), passeport, carte consulaire, carte étrangère. Rejeter si : le self given name diffère du nom sur la CNI, le type de document n'est pas accepté, les informations ne sont pas lisibles, ou le document est expiré. Corriger si le nom sur Front ne correspond pas au document.",
  },
  {
    id: "rename-user",
    title: "Rename User — conformité du nom",
    page: "p. 58-59",
    keywords: ["rename user", "nom", "incohérence", "conformité", "self given name"],
    excerpt:
      "Le Rename User permet de modifier le nom d'un titulaire de compte : identification du client, s'assurer qu'il appelle avec le numéro concerné, valider le nom complet et procéder au rename en cas d'erreur de saisie ou d'incohérence entre le self given name et le nom de la CNI (questions de sécurité pour un KYC2).",
  },
  {
    id: "minor",
    title: "Minor compliance — contrôle parental",
    page: "p. 102-108",
    keywords: ["mineur", "autorisation parentale", "garant", "tuteur", "18 ans", "kyc2", "lien"],
    excerpt:
      "Est considéré comme mineur le client KYC2 de moins de 18 ans : l'aval du parent ou du garant est requis pour transacter. Le garant doit impérativement être KYC2, majeur et connecté à l'application. Après validation des points de contrôle, envoyer le lien de demande d'autorisation (mineur) ou d'approbation (parent) sur Front.",
  },
  {
    id: "rebalance",
    title: "Rebalance / rééquilibrage agent",
    page: "p. 126-127",
    keywords: ["rebalance", "rééquilibrage", "reequilibrage", "agent", "uv", "e-float"],
    excerpt:
      "Le Rebalance est l'action d'approvisionnement de l'agent en UV (e-float) ou en cash, via plusieurs canaux : banque (UV), Premium, Master. Le FO fait la remontée à l'équipe habilitée pour prise en charge.",
  },
  {
    id: "restriction-device",
    title: "Restrictions de compte & change device",
    page: "p. 184-193",
    keywords: [
      "restriction",
      "device",
      "change device",
      "disable feature",
      "diseable feature",
      "blocage",
      "se reconnecter",
      "appareil",
    ],
    excerpt:
      "Une restriction est une mesure de sécurité posée sur le compte : le rep doit expliquer la raison du blocage, demander au client l'action souhaitée (change device ou désactivation de la fonctionnalité) et respecter le process avant toute levée. En cas de restriction liée à la fraude, transfert vers la team dédiée.",
  },
  {
    id: "security-challenge",
    title: "Security challenge / Request to unblock",
    page: "p. 183-184",
    keywords: ["security challenge", "blocage", "transactions", "unblock", "fraude", "vérifications"],
    excerpt:
      "Identifier le client (prénom - nom) puis cliquer sur « Request to unblock » : un ticket est généré au niveau de la team fraude qui recontactera le client. PS : aucun délai n'est à communiquer, on invite simplement le client à patienter. Le Block on Deposit concerne les comptes suspectés de gaming.",
  },
  {
    id: "b2w",
    title: "Bank to Wallet (B2W)",
    page: "p. 115-117",
    keywords: ["b2w", "lier ses comptes", "bank", "cni", "back office", "#1"],
    excerpt:
      "Le B2W (Bank to Wallet) permet de lier un compte bancaire au wallet. Le FO s'assure que le client dispose de sa CNI, laisse une note et transfère l'appel au Back Office, qui dispose des accès pour finaliser la liaison des comptes.",
  },
  {
    id: "vault",
    title: "Coffre / Vault",
    page: "p. 99-100",
    keywords: ["coffre", "vault", "débloquer", "bloquer", "move vault"],
    excerpt:
      "Le coffre (Vault) permet au client de mettre des fonds de côté. Avant tout déblocage, informer le client qu'une fois le coffre débloqué il ne pourra plus le rebloquer avant le mois suivant, et recueillir son accord. Un move vault balance relève du Back Office : transfert de l'appel au #1.",
  },
  {
    id: "call-transfer",
    title: "Transferts d'appel & escalade",
    page: "p. 193",
    keywords: ["transfère l'appel", "transfert", "back office", "#1", "#2", "escalade", "remontée", "accès"],
    excerpt:
      "Call Transfer : Back-office #1, Fraud Team #2, Pulhar Speaker #7. Lorsque le FO ne dispose pas des accès pour traiter une requête, il laisse une note claire sur Front, invite le client à rester en ligne et transfère l'appel vers l'équipe compétente.",
  },
  {
    id: "posture",
    title: "Posture & qualité de service",
    page: "p. 4, 36, 43",
    keywords: [
      "présentation",
      "présenté",
      "identification",
      "congé",
      "closing",
      "compréhension",
      "attente",
      "remercier",
      "nominative",
      "accueil",
    ],
    excerpt:
      "Objectif opérationnel : traiter efficacement les demandes clients en respectant les procédures établies et garantir une qualité de service conforme aux standards de Wave. Cela implique une présentation en début d'appel, une identification conforme (nom, prénom, numéro concerné), l'explication claire des étapes, la validation de la compréhension du client et une prise de congé structurée.",
  },
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Retourne les extraits du training book qui justifient un commentaire. */
export function findTrainingRefs(
  typologyTitle: string,
  text: string,
  limit = 2,
): TrainingSection[] {
  const haystack = norm(`${typologyTitle} ${typologyTitle} ${text}`);
  const scored = TRAINING_SECTIONS.map((section) => {
    let score = 0;
    for (const kw of section.keywords) {
      if (haystack.includes(norm(kw))) score += Math.min(kw.length, 20);
    }
    if (haystack.includes(norm(section.title.split("—")[0].trim()))) score += 25;
    return { section, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.section);
}

/**
 * Détecte automatiquement la typologie probable d'une description libre,
 * en s'appuyant uniquement sur le texte saisi (sans titre).
 */
export function detectTypologyFromText(
  text: string,
  knownTitles: string[] = [],
): { title: string; confidence: number; sections: TrainingSection[] } | null {
  const clean = text.trim();
  if (clean.length < 12) return null;
  const haystack = norm(clean);

  const scored = TRAINING_SECTIONS.map((section) => {
    let score = 0;
    for (const kw of section.keywords) {
      if (haystack.includes(norm(kw))) score += Math.min(kw.length, 20);
    }
    return { section, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) return null;

  const best = scored[0];
  const base = best.section.title.split("—")[0].trim();

  // Si l'utilisateur a déjà une typologie proche, on réutilise son intitulé.
  const known = knownTitles.find(
    (t) => norm(t) === norm(base) || norm(base).includes(norm(t)) || norm(t).includes(norm(base)),
  );

  return {
    title: known ?? base,
    confidence: Math.min(100, Math.round((best.score / 40) * 100)),
    sections: scored.slice(0, 2).map((s) => s.section),
  };
}


/** Training book (PDF hébergé avec l'app) — ouvrable à une page précise. */
export const TRAINING_BOOK_URL =
  "/__l5e/assets-v1/79c5e631-70e3-4f4f-b76d-079368bd70cf/training-book.pdf";

/** Lien vers le training book, positionné sur la page du process concerné. */
export function trainingRefUrl(section: TrainingSection): string {
  const match = section.page.match(/\d+/);
  return `/api/training-book#page=${match?.[0] ?? "1"}&zoom=page-fit`;
}

