// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import {
//   doc,
//   getDoc,
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   Timestamp,
//   onSnapshot,
//   DocumentReference,
//   DocumentData,
// } from "firebase/firestore";
// import { db } from "../../firebase"; // Adjust the path if necessary
// import Cookies from "universal-cookie";

// interface Message {
//   sender: string;
//   senderName: string;
//   text: string;
//   timestamp: Timestamp;
// }

// const ChatDetails: React.FC = () => {
//   const router = useRouter();
//   const { id, mobileNumber } = router.query;
//   const [user, setUser] = useState<any>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState<string>("");
//   const cookies = new Cookies();

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (id) {
//         try {
//           const userDoc = await getDoc(doc(db, "users", id as string));
//           if (userDoc.exists()) {
//             setUser({ id: userDoc.id, ...userDoc.data() });
//           } else {
//             console.error("User not found");
//             setUser(null); // Set user to null if not found
//           }
//         } catch (error) {
//           console.error("Error fetching user: ", error);
//         }
//       }
//     };

//     fetchUser();
//   }, [id]);

//   useEffect(() => {
//     const createChatRoom = async () => {
//       if (id && mobileNumber) {
//         const chatRoomId = [id as string, mobileNumber as string]
//           .sort()
//           .join("_");
//         try {
//           const chatRoomRef = doc(db, "chats", chatRoomId);
//           await setDoc(chatRoomRef, {
//             participants: [id as string, mobileNumber as string],
//             createdAt: Timestamp.now(),
//           });
//         } catch (error) {
//           console.error("Error creating chat room: ", error);
//         }
//       }
//     };

//     createChatRoom();
//   }, [id, mobileNumber]);

//   const handleSendMessage = async () => {
//     if (!user || !newMessage.trim()) {
//       return; // Exit early if user is null or newMessage is empty
//     }

//     const message: Message = {
//       sender: user.id,
//       senderName: user.name,
//       text: newMessage,
//       timestamp: Timestamp.now(),
//     };
//     const chatRoomId = [id as string, mobileNumber as string].sort().join("_");
//     try {
//       const messageRef = await addDoc(
//         collection(db, "chats", chatRoomId, "messages"),
//         message
//       );
//       setMessages([...messages, message]);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   };

//   useEffect(() => {
//     if (!id || !mobileNumber) return;

//     const chatRoomId = [id as string, mobileNumber as string].sort().join("_");
//     const q = query(
//       collection(db, "chats", chatRoomId, "messages"),
//       orderBy("timestamp", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const messagesData = snapshot.docs.map((doc) => doc.data() as Message);
//       setMessages(messagesData);
//     });

//     return () => unsubscribe();
//   }, [id, mobileNumber]);

//   // Conditional rendering to handle `user` being null or undefined
//   if (user) {
//     return (
//       <div className="max-w-md mx-auto mt-8">
//         <p className="text-center text-gray-500">Loading user details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto mt-8">
//       {/* <h2 className="text-2xl mb-4">{user.name}</h2> */}
//       <div className="flex flex-col h-screen">
//         <div className="flex-1 p-4 overflow-y-auto">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex ${
//                 message.sender === user.id ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-xs px-4 py-2 rounded-lg ${
//                   message.sender === user.id
//                     ? "bg-blue-500 text-white"
//                     : "bg-gray-300"
//                 }`}
//               >
//                 <p className="text-sm text-gray-600">{message.senderName}</p>
//                 <p>{message.text}</p>
//                 <p className="text-xs text-gray-400">
//                   {new Date(message.timestamp.toMillis()).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="p-4 border-t border-gray-200">
//           <input
//             type="text"
//             className="w-full px-4 py-2 border rounded-lg"
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatDetails;

import React from "react";

function ChatDetails() {
  return <div></div>;
}

export default ChatDetails;
