import { useChatStore } from "../../store/useChatStore";

import Sidebar from "../../components/Chat/Sidebar";
import NoChatSelected from "../../components/Chat/NoChatSelected";
import ChatContainer from "../../components/Chat/ChatContainer";
import SidebarLayout from "../../components/layouts/SidebarLayout";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <SidebarLayout>
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-7 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
    </SidebarLayout>
  );
};
export default HomePage;