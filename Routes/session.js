const express = require('express');
const router = express.Router();
const General = require('../Workers/General');
const Session = require('../Database/models/Session');
const student = require('../Database/models/students');

router.post('/createSession', async (req, res) => {
    try {
       
        const { sessionTitle, courseType, students } = req.body;

        // Validate incoming data
        if (!sessionTitle || !courseType || !students || !Array.isArray(students)) {
            return res.status(400).json({ error: 'Invalid data format.' });
        }

        // Generate session ID 
        const sessionId = General.generateSessionId(courseType);


        // Create a new session
        const session = new Session({
            sessionId,
            sessionTitle,
            courseType,
     
        });

        await session.save();

        // Prepare student data
        const studentDocuments =  students.map((student)  =>  ({
            sessionId,
            studentId: General.generateStudentId(courseType),
            cuetApplicationNo: student.cuetApplicationNo,
            studentName: student.studentName,
            dob: new Date(student.dob),
            email: student.email,
            phone: student.phone,
            gender: student.gender,
            category: student.category,
            cuetScore: student.cuetScore,
            course: student.course,
            password :  General.generatePassword(),
            role: 'student',
            isVerified : false,
            AccountStatus : true
        }));

        // Save all student data to the database
        await Student.insertMany(studentDocuments);
        
        res.status(201).json({
            message: 'Session and student data created successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


module.exports = router;