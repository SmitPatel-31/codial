import { db,auth,app } from '../src/app/firebase';
import { getFirestore, doc, getDoc,collection, getDocs,updateDoc,arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid"; 
export async function getUserData(uid) {
    if (!uid) {
      throw new Error("UID is required to fetch user data.");
    }
  
    try {
      const userRef = doc(db, "users", uid); 
      const userSnap = await getDoc(userRef); 
      if (userSnap.exists()) {
        return userSnap.data(); 
      } else {
        console.log("No user found with this UID.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }



  
  export async function getExams() {
    try {
      const examCollectionRef = collection(db, "codingTest"); // Reference to the collection
      const querySnapshot = await getDocs(examCollectionRef); // Get all documents
  
      if (!querySnapshot.empty) {
        const exams = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            date: new Date(data.date.seconds * 1000), // Return as Date object
            endDate: new Date(data.endDate.seconds * 1000),
            joined: data.joined || [],
          };
        });
  
        console.log("Formatted Exam Data:", exams);
        return exams;
      } else {
        console.log("No exams found.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      throw error;
    }
  }



  export async function handleStartExam (exam, userData, router) {
    if (!userData) return;
    const sessionId = uuidv4(); 
    const examRef = doc(db, "codingTest", exam.id);
    const examSnapshot = await getDoc(examRef);
  
    if (examSnapshot.exists()) {
      const examData = examSnapshot.data();
      console.log("Exam Data:", examData);
      // Check if the user has already joined
      const isAlreadyJoined = examData.joined?.some((entry) => entry.uid === userData.uid);
      
      console.log("Is Already Joined:", isAlreadyJoined);
      if (isAlreadyJoined) {
        alert("You have already joined this exam!");
        return;
      }
      sessionStorage.setItem("allowedExamId", exam.id);
      sessionStorage.setItem("sessionKey", sessionId);
      // Update Firestore: Add user to joined array
      await updateDoc(examRef, {
        joined: arrayUnion({ uid: userData.uid, name: userData.name,nuId:userData.nuId, }) // Storing name for better tracking
      });
  
      // Redirect to the exam page
      router.push(`/exam/${exam.id}?session=${sessionId}`);
    }
  };