import cron from "node-cron";
import { asyncHandler } from "./asyncHandler.js";
import { Student } from "../models/students.model.js";
import sendEmail from "./sendEmail.js";
import { Notification } from "../models/notification.model.js";

const birthdayWish = asyncHandler(async () => {
    try {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const studentsWithBirthday = await Student.find({
            $expr: {
                $and: [
                    { $eq: [{ $month: { $toDate: "$dateOfBirth" } }, month] }, // Convert to Date
                    { $eq: [{ $dayOfMonth: { $toDate: "$dateOfBirth" } }, day] } // Convert to Date
                ]
            }
        });

        if (studentsWithBirthday.length > 0) {
            for (const student of studentsWithBirthday) {
                const subject = `Happy Birthday, ${student.firstName} ${student.lastName}! 🎉`;

                const email = student.studentEmail;
                const message = `
                🌟 Happy Birthday, ${student.firstName} ${student.lastName}! 🎈🎉

                Hey there, superstar! ✨ Today is YOUR special day, and the world is celebrating YOU! 🎂🥳

                May your day be filled with big smiles, awesome adventures, and tons of fun! 🎁🚀 Always remember—you are strong, smart, and capable of achieving anything you dream of! 💪💡

                Keep shining bright like the amazing star that you are! 🌟 The best is yet to come, and I can’t wait to see you grow, learn, and make the world a better place! 🌍💙

                Enjoy your special day, little champ! 🎂🎊

                With lots of hugs and high-fives,
                Ishanya
                `;

                try {
                    await sendEmail(email, subject, message);
                    await Notification.create({
                        message: `Happy Birthday ${student.firstName} ${student.lastName}`,
                    });

                    console.log(`🎉 Notification created for ${student.firstName} ${student.lastName}`);
                } catch (error) {
                    console.error(`🚨 Failed to send email to ${email}:`, error);
                }
            }
        } else {
            console.log("🎂 No birthdays today.");
        }
    } catch (err) {
        console.error(`⚠️ Error occurred while scheduling birthday wish: ${err}`);
    }
});

export const scheduleBirthdayWish = function () {
    console.log("⏳ Initializing birthday cron job...");

    // Schedule the cron job to run at midnight every day (00:00 AM)
    // for 12at midnight -> 0 0 * * * 
    // for after every 1 min -> * * * * * 
    cron.schedule("0 0 * * *", async () => {
        console.log("🔔 Checking for birthdays at midnight...");
        await birthdayWish();
    });

    console.log("✅ Birthday cron job scheduled to run at midnight (00:00 AM) daily.");
};
