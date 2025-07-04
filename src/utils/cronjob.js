const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

// Cron runs at 8 AM every day (server time)
cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    // Find requests from yesterday with status "interested"
    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    // Extract unique recipient emails
    const listOfEmails = [
      ...new Set(
        pendingRequests
          .map((req) => req.toUserId?.emailId)
          .filter(Boolean) // Exclude null/undefined
      ),
    ];

    console.log("Pending reminder emails to send:", listOfEmails);

    for (const email of listOfEmails) {
      try {
        await sendEmail.run(
          `⏰ You have pending connection requests on DevMatch`,
          `Hi there, you have friend requests that are still pending from yesterday. Please <a href="https://devmatch.shop/">log in</a> to review them.`
          , email // Pass email to SES handler
        );
        console.log(`✅ Reminder email sent to: ${email}`);
      } catch (err) {
        console.error(`❌ Failed to send email to ${email}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Cron job error:", err.message);
  }
});
