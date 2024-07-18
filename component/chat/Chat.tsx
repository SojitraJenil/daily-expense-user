import { useRouter } from "next/router";
import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAtom } from "jotai";
import { userAtom } from "atom/atom";

const Chat = () => {
  const router = useRouter();
  const [users] = useAtom(userAtom);

  console.log("users===========>", users);
  const handleUserClick = (id: string, mobileNumber?: string) => {
    router.push(`/chatDetails/?mobileNumber=${mobileNumber}/?id=${id}`);
  };

  return (
    <>
      <div className="bg-gray-200 overflow-y-auto">
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center px-2 py-1 border-b-2 bg-[#CBD5E4]"
              onClick={() => handleUserClick(user._id, user.mobileNumber)}
            >
              <div className="text-black">
                <FaUserCircle className="w-10 h-10 mr-2" />
              </div>
              <div className="text-black pb-1">
                <p className="text-[18px] ps-3 font-semibold">
                  {user.id === "5AfW9NT1FIYaTVxYMp9A" ? "JUI" : user.name}
                </p>
                <span className="text-[14px] text-gray-600 ps-3 font-semibold">
                  {user.mobileNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div />
    </>
  );
};

export default Chat;
