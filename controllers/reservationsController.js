const reservationModel = require("../models/reservation");
const { sendEmail } = require("../utils/emailUtils.js");

const createReservation = async (req, res) => {
    try {
        const {
            serviceType,
            eventType,
            menuType,
            dietaryRestrictions,
            guestCount,
            meatType,
            lieuEvenement,
            villeEvenement,
            setupLocation,
            spaceDescription,
            date: eventDate,
            time: eventTime,
            budget,
            additionalRequests,
            name,
            email,
            phone,
        } = req.body;

        // Récupérer la date et l'heure de la réception du formulaire
        const receptionDate = new Date();

        // Vérifier s'il existe déjà une réservation pour le même lieu, date et heure
        const existingReservation =
            await reservationModel.findOneByLieuDateHeure(
                lieuEvenement,
                eventDate,
                eventTime
            );

        if (existingReservation) {
            return res.status(409).json({
                message:
                    "Une réservation existe déjà pour ce lieu, cette date et cette heure. Veuillez vérifier les informations ou nous contacter.",
            });
        }

        const newReservation = await reservationModel.create({
            service_demande: serviceType,
            type_evenement: eventType,
            type_menu: menuType,
            restrictions_alimentaires: dietaryRestrictions,
            nombre_personnes: guestCount,
            type_viande: meatType,
            lieu_evenement: lieuEvenement,
            ville_evenement: villeEvenement,
            lieu_installation: setupLocation,
            description_espace: spaceDescription,
            date_evenement: eventDate,
            heure_evenement: eventTime,
            budget: budget,
            demandes_additionnelles: additionalRequests,
            nom_client: name,
            email_client: email,
            telephone_client: phone,
            date_reception: receptionDate,
        });
        res.status(201).json(newReservation);

        // --- Envoi de l'email à l'administrateur ---
        const adminSubject = "Nouvelle réservation reçue !";
        const adminHtml = `<p>Une nouvelle réservation a été faite le ${receptionDate.toLocaleString(
            "fr-CA",
            { timeZone: "America/Montreal" }
        )} :</p>
                           <ul>
                               <li>Nom du client: ${name}</li>
                               <li>Email du client: ${email}</li>
                               <li>Téléphone: ${phone || "Non fourni"}</li>
                               <li>Service demandé: ${serviceType}</li>
                               <li>Date de l'événement: ${eventDate}</li>
                               <li>Heure de l'événement: ${eventTime}</li>
                               <li>Lieu de l'événement: ${
                                   lieuEvenement || "Non fourni"
                               }</li>
                               <li>Ville de l'événement: ${
                                   villeEvenement || "Non fourni"
                               }</li>
                               <li>Nombre de personnes: ${guestCount}</li>
                               ${
                                   eventType
                                       ? `<li>Type d'événement: ${eventType}</li>`
                                       : ""
                               }
                               ${
                                   menuType
                                       ? `<li>Type de menu: ${menuType}</li>`
                                       : ""
                               }
                               ${
                                   dietaryRestrictions?.length > 0
                                       ? `<li>Restrictions alimentaires: ${dietaryRestrictions.join(
                                             ", "
                                         )}</li>`
                                       : ""
                               }
                               ${
                                   meatType
                                       ? `<li>Type de viande: ${meatType}</li>`
                                       : ""
                               }
                               ${
                                   setupLocation
                                       ? `<li>Lieu d'installation: ${setupLocation}</li>`
                                       : ""
                               }
                               ${
                                   spaceDescription
                                       ? `<li>Description de l'espace: ${spaceDescription}</li>`
                                       : ""
                               }
                               ${
                                   budget
                                       ? `<li>Budget estimé: ${budget}</li>`
                                       : ""
                               }
                               <li>Demandes additionnelles: ${
                                   additionalRequests || "Aucune"
                               }</li>
                           </ul>`;
        sendEmail(
            "ulrichfranklinlontsinobossi@gmail.com",
            adminSubject,
            adminHtml
        );

        // --- Envoi de l'email de confirmation au client (Optionnel) ---
        const clientSubject = `Confirmation de votre demande de réservation chez Mamdjui Cuisine & Events`;
        const clientHtml = `<p>Bonjour ${name},</p>
                            <p>Nous avons bien reçu votre demande de réservation le ${receptionDate.toLocaleString(
                                "fr-CA",
                                { timeZone: "America/Montreal" }
                            )} pour le ${eventDate} à ${eventTime} à ${
            lieuEvenement || "l'endroit spécifié"
        } à ${villeEvenement || "la ville spécifiée"}.</p>
                            <p>Nous allons l'examiner attentivement et vous recontacterons dans les plus brefs délais pour confirmer les détails et la disponibilité.</p>
                            <p>Merci de votre intérêt !</p>
                            <p>Cordialement,</p>
                            <p>L'équipe de Mamdjui Cuisine & Events</p>`;
        sendEmail(email, clientSubject, clientHtml);
    } catch (error) {
        console.error("Erreur lors de la création de la réservation:", error);
        res.status(500).json({
            error: "Erreur serveur lors de la création de la réservation.",
        });
    }
};

const getAllReservations = async (req, res) => {
    try {
        const reservations = await reservationModel.getAll();
        res.json(reservations);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des réservations:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const deleteReservation = async (req, res) => {
    const { id } = req.params;
    console.log("ID à supprimer (Controller):", id);
    try {
        const reservationToDelete = await reservationModel.getById(id);
        const result = await reservationModel.deleteReservation(id);
        res.status(204).send(); // No content

        // --- Envoi de l'email à l'administrateur ---
        if (reservationToDelete && reservationToDelete.email_client) {
            const adminSubject = `Réservation supprimée`;
            const adminHtml = `<p>La réservation pour le client ${reservationToDelete.nom_client} (${reservationToDelete.email_client}) a été supprimée par l'administrateur.</p>
                               <p>Date de l'événement prévue : ${reservationToDelete.date_evenement} à ${reservationToDelete.heure_evenement}.</p>`;
            sendEmail(
                "ulrichfranklinlontsinobossi@gmail.com",
                adminSubject,
                adminHtml
            );

            // --- Envoi de l'email d'annulation au client (Optionnel) ---
            const clientSubject = `Votre réservation chez Mamdjui Cuisine & Events a été annulée`;
            const clientHtml = `<p>Bonjour ${reservationToDelete.nom_client},</p>
                                <p>Nous vous informons que votre réservation prévue pour le ${reservationToDelete.date_evenement} à ${reservationToDelete.heure_evenement} a été annulée.</p>
                                <p>Pour toute question, n'hésitez pas à nous contacter.</p>
                                <p>Cordialement,</p>
                                <p>L'équipe de Mamdjui Cuisine & Events</p>`;
            sendEmail(
                reservationToDelete.email_client,
                clientSubject,
                clientHtml
            );
        }
    } catch (error) {
        console.error(
            "Erreur lors de la suppression de la réservation:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const updateReservationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || (status !== "EN COURS" && status !== "FAIT")) {
        return res.status(400).json({ message: "Statut invalide." });
    }

    try {
        const updatedReservation = await reservationModel.updateStatus(
            id,
            status
        );
        if (updatedReservation) {
            res.json(updatedReservation);

            // --- Envoi de l'email à l'administrateur ---
            const adminSubject = `Statut de la réservation mis à jour`;
            const adminHtml = `<p>Le statut de la réservation pour le client ${updatedReservation.nom_client} (${updatedReservation.email_client}) a été mis à jour à : <strong>${status}</strong>.</p>
                               <p>Date de l'événement prévue : ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement}.</p>`;
            sendEmail(
                "ulrichfranklinlontsinobossi@gmail.com",
                adminSubject,
                adminHtml
            );

            const clientSubjectBase = `Mise à jour du statut de votre réservation chez Mamdjui Cuisine & Events`;
            let clientHtml;

            if (status === "FAIT") {
                clientHtml = `<p>Bonjour ${updatedReservation.nom_client},</p>
                                <p>Le statut de votre réservation prévue pour le ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement} a été mis à jour à : <strong>${status}</strong>.</p>
                                <p>Nous espérons que votre événement s'est déroulé à merveille et que vous avez été pleinement satisfait de nos services.</p>
                                <p>Notre équipe reste à votre entière écoute pour vos futurs événements et se fera un plaisir de vous accompagner à nouveau.</p>
                                <p>Au plaisir de vous revoir !</p>
                                <p>Cordialement,</p>
                                <p>L'équipe de Mamdjui Cuisine & Events</p>`;
            } else {
                clientHtml = `<p>Bonjour ${updatedReservation.nom_client},</p>
                                <p>Le statut de votre réservation prévue pour le ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement} a été mis à jour à : <strong>${status}</strong>.</p>
                                <p>Nous vous tiendrons informés des prochaines étapes.</p>
                                <p>Cordialement,</p>
                                <p>L'équipe de Mamdjui Cuisine & Events</p>`;
            }

            sendEmail(
                updatedReservation.email_client,
                clientSubjectBase,
                clientHtml
            );
        } else {
            res.status(404).json({ message: "Réservation non trouvée." });
        }
    } catch (error) {
        console.error(
            "Erreur lors de la mise à jour du statut de la réservation:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const updateReservationValidation = async (req, res) => {
    const { id } = req.params;
    const { est_valide } = req.body;

    if (typeof est_valide !== "boolean") {
        return res
            .status(400)
            .json({ message: "État de validation invalide." });
    }

    try {
        const updatedReservation = await reservationModel.updateValidation(
            id,
            est_valide
        );
        if (updatedReservation) {
            res.json(updatedReservation);

            // --- Envoi de l'email à l'administrateur ---
            const validationStatus = est_valide ? "validée" : "invalidée";
            const adminSubject = `Réservation ${validationStatus}`;
            const adminHtml = `<p>La réservation pour le client ${updatedReservation.nom_client} (${updatedReservation.email_client}) a été marquée comme <strong>${validationStatus}</strong>.</p>
                               <p>Date de l'événement prévue : ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement}.</p>`;
            sendEmail(
                "ulrichfranklinlontsinobossi@gmail.com",
                adminSubject,
                adminHtml
            );

            // --- Envoi de l'email de notification au client (Optionnel) ---
            if (est_valide) {
                const clientSubject = `Votre réservation chez Mamdjui Cuisine & Events a été validée !`;
                const clientHtml = `<p>Bonjour ${updatedReservation.nom_client},</p>
                                    <p>Nous sommes heureux de vous informer que votre réservation prévue pour le ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement} a été <strong>validée</strong>.</p>
                                    <p>Nous vous contacterons prochainement pour discuter des détails supplémentaires.</p>
                                    <p>Cordialement,</p>
                                    <p>L'équipe de Mamdjui Cuisine & Events</p>`;
                sendEmail(
                    updatedReservation.email_client,
                    clientSubject,
                    clientHtml
                );
            } else {
                const clientSubject = `Mise à jour de votre réservation chez Mamdjui Cuisine & Events`;
                const clientHtml = `<p>Bonjour ${updatedReservation.nom_client},</p>
                                    <p>Nous vous informons que votre réservation prévue pour le ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement} a été mise à jour.</p>
                                    <p>Nous vous prions de nous contacter pour discuter des détails.</p>
                                    <p>Cordialement,</p>
                                    <p>L'équipe de Mamdjui Cuisine & Events</p>`;
                sendEmail(
                    updatedReservation.email_client,
                    clientSubject,
                    clientHtml
                );
            }
        } else {
            res.status(404).json({ message: "Réservation non trouvée." });
        }
    } catch (error) {
        console.error(
            "Erreur lors de la mise à jour de la validation de la réservation:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

const validateReservation = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedReservation = await reservationModel.updateValidation(
            id,
            true
        ); // Marquer comme validé
        if (updatedReservation) {
            res.json({
                message: `La réservation ${id} a été validée.`,
                reservation: updatedReservation,
            });

            // --- Envoi de l'email à l'administrateur ---
            const adminSubject = `Réservation validée`;
            const adminHtml = `<p>La réservation pour le client ${updatedReservation.nom_client} (${updatedReservation.email_client}) a été validée.</p>
                               <p>Date de l'événement prévue : ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement}.</p>`;
            sendEmail(
                "ulrichfranklinlontsinobossi@gmail.com",
                adminSubject,
                adminHtml
            );

            // --- Envoi de l'email de confirmation au client ---
            const clientSubject = `Votre réservation chez Mamdjui Cuisine & Events a été validée !`;
            const clientHtml = `<p>Bonjour ${updatedReservation.nom_client},</p>
                                <p>Nous sommes heureux de vous informer que votre réservation prévue pour le ${updatedReservation.date_evenement} à ${updatedReservation.heure_evenement} a été validée.</p>
                                <p>Nous vous contacterons prochainement pour discuter des détails supplémentaires.</p>
                                <p>Cordialement,</p>
                                <p>L'équipe de Mamdjui Cuisine & Events</p>`;
            sendEmail(
                updatedReservation.email_client,
                clientSubject,
                clientHtml
            );
        } else {
            res.status(404).json({ message: "Réservation non trouvée." });
        }
    } catch (error) {
        console.error("Erreur lors de la validation de la réservation:", error);
        res.status(500).json({
            error: "Erreur serveur lors de la validation.",
        });
    }
};
const getReservationsCount = async (req, res) => {
    try {
        const count = await reservationModel.getTotalReservations();
        res.json({ count });
    } catch (error) {
        console.error(
            "Erreur lors de la récupération du nombre total de réservations:",
            error
        );
        res.status(500).json({ error: "Erreur serveur" });
    }
};

module.exports = {
    createReservation,
    getAllReservations,
    deleteReservation,
    updateReservationStatus,
    updateReservationValidation,
    validateReservation,
    getReservationsCount,
};
