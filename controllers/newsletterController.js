const newsletterModel = require("../models/newsletterSubscription");
const { sendEmail } = require("../utils/emailUtils.js"); // Utilisez require

const subscribeNewsletter = async (req, res) => {
    const { email, nom } = req.body;
    if (!email || !nom) {
        return res.status(400).json({ error: "L'email et le nom sont requis" });
    }
    try {
        const subscription = await newsletterModel.subscribe(email, nom);
        if (subscription === null) {
            return res
                .status(409)
                .json({ message: "Cet email est déjà abonné" });
        }

        // --- Envoi de l'email à l'administrateur ---
        const adminSubject = "Nouvelle inscription à la newsletter !";
        const adminHtml = `<p>Un nouvel utilisateur s'est inscrit à la newsletter :</p>
                           <ul>
                               <li>Nom: ${nom}</li>
                               <li>Email: ${email}</li>
                           </ul>`;
        sendEmail("ulrichfranklinlontsinobossi@gmail.com", adminSubject, adminHtml); // REMPLACER PAR L'EMAIL DE L'ADMIN

        // --- Envoi de l'email de confirmation au client ---
        const clientSubject = `Confirmation de votre inscription à la newsletter de [Nom de votre site]`; // REMPLACER PAR LE NOM DE VOTRE SITE
        const clientHtml = `<p>Bonjour ${nom},</p>
                            <p>Merci de vous être inscrit à notre newsletter ! Vous recevrez prochainement des nouvelles, des offres et des mises à jour de Mamdjui Cuisine & Events.</p>
                            <p>À bientôt !</p>`;
        sendEmail(email, clientSubject, clientHtml);

        res.status(201).json({
            message: `Inscription de ${nom} à la newsletter réussie`,
        });
    } catch (error) {
        console.error("Erreur lors de l'abonnement à la newsletter:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const getNewsletterEmails = async (req, res) => {
    try {
        const emails = await newsletterModel.getAllEmails();
        res.json(emails);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des emails de la newsletter:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const getNewsletterList = async (req, res) => {
    try {
        const subscribers = await newsletterModel.getAllSubscribersWithName();
        res.json(subscribers);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération de la liste des abonnés à la newsletter:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const deleteNewsletterEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const subscriber = await newsletterModel.findByEmail(email); // Récupérer les informations de l'abonné avant la suppression
        if (!subscriber) {
            return res
                .status(404)
                .json({ message: "Cet email n'est pas abonné." });
        }

        await newsletterModel.deleteByEmail(email);

        // --- Envoi de l'email à l'administrateur ---
        const adminSubject = "Suppression d'un abonné à la newsletter";
        const adminHtml = `<p>L'adresse email suivante a été supprimée de la liste de la newsletter :</p>
                           <ul>
                               <li>Nom: ${subscriber.nom}</li>
                               <li>Email: ${email}</li>
                           </ul>`;
        sendEmail(
            "ulrichfranklinlontsinobossi@gmail.com",
            adminSubject,
            adminHtml
        ); // REMPLACER PAR L'EMAIL DE L'ADMIN

        // --- Envoi de l'email de notification au client ---
        const clientSubject = `Confirmation de votre désabonnement à la newsletter de Mamdjui Cuisine & Events`; // REMPLACER PAR LE NOM DE VOTRE SITE
        const clientHtml = `<p>Bonjour ${subscriber.nom},</p>
                            <p>Nous vous confirmons que votre adresse email (${email}) a été retirée de notre liste d'information.</p>
                            <p>Nous espérons vous revoir bientôt !</p>`;
        sendEmail(email, clientSubject, clientHtml);

        res.status(204).send(); // No content
    } catch (error) {
        console.error(
            "Erreur lors de la suppression de l'email de la newsletter:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};
const getNewsletterCount = async (req, res) => {
    try {
        const count = await newsletterModel.getTotalSubscribers();
        res.json({ count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total d'abonnés:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};
const sendBulkNewsletterEmail = async (req, res) => {
    try {
        const { subject, body } = req.body;

        if (!subject || !body) {
            return res
                .status(400)
                .json({
                    message: "Le sujet et le corps de l'e-mail sont requis.",
                });
        }

        const subscribers = await newsletterModel.getAllSubscribersWithName();

        if (subscribers.length === 0) {
            return res
                .status(200)
                .json({ message: "Aucun abonné à la newsletter trouvé." });
        }

        let successCount = 0;
        let errorCount = 0;

        for (const subscriber of subscribers) {
            const emailSent = await sendEmail(subscriber.email, subject, body);
            if (emailSent) {
                successCount++;
            } else {
                errorCount++;
            }
        }

        res.status(200).json({
            message: `E-mails envoyés avec succès à ${successCount} abonnés. ${
                errorCount > 0 ? `Échecs d'envoi à ${errorCount} abonnés.` : ""
            }`,
        });
    } catch (error) {
        console.error("Erreur lors de l'envoi groupé d'e-mails:", error);
        res.status(500).json({
            error: "Erreur serveur lors de l'envoi groupé.",
        });
    }
};

module.exports = {
    subscribeNewsletter,
    getNewsletterEmails,
    getNewsletterList,
    deleteNewsletterEmail,
    getNewsletterCount,
    sendBulkNewsletterEmail,
};
