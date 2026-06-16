
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    // Simple validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // OPTION A: Save to the database (since a "db" folder exists in your project)
        // await db.collection('messages').add({ name, email, message, timestamp: new Date() });

        // OPTION B: For now, log it and return success
        console.log(`New Message from ${name} (${email}): ${message}`);

        return res.status(200).json({ message: 'Message received successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
}