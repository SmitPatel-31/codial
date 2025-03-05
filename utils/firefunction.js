import { db,auth,app } from '../src/app/firebase';
import { getFirestore, doc, getDoc,collection, getDocs } from "firebase/firestore";

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