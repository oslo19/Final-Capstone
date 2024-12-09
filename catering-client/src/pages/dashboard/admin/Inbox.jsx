import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';



const Inbox = ({ adminId }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', adminId);

    socket.on('message', (message) => {
      if (message.recipient === adminId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        updateConversations(message.sender);
      }
    });

    // Fetch existing conversations and messages
    fetchConversations();

    return () => {
      socket.off('message');
    };
  }, [adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    // Implement API call to fetch conversations for the admin
    // This should return a list of users who have chatted with the admin
    // For now, we'll use a placeholder
    setConversations([
      { id: 'user1', name: 'User 1' },
      { id: 'user2', name: 'User 2' },
    ]);
  };

  const selectUser = async (userId) => {
    setSelectedUser(userId);
    // Fetch messages for the selected user
    // Implement API call to fetch messages between admin and selected user
    // For now, we'll use a placeholder
    setMessages([
      { sender: userId, recipient: adminId, text: 'Hello, I need help' },
      { sender: adminId, recipient: userId, text: 'Sure, how can I assist you?' },
    ]);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && selectedUser) {
      const newMessage = { sender: adminId, recipient: selectedUser, text: inputMessage };
      socket.emit('sendMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
    }
  };

  const updateConversations = (userId) => {
    if (!conversations.some(conv => conv.id === userId)) {
      setConversations(prevConvs => [...prevConvs, { id: userId, name: `User ${userId}` }]);
    }
  };

  return (
    <div className="h-screen w-full flex antialiased text-gray-800 bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        <main className="flex-grow flex flex-row min-h-0">
          <section className="flex flex-col flex-none overflow-auto w-24 group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out">
            <div className="header p-4 flex flex-row justify-between items-center flex-none">
              <p className="text-md font-bold">Inbox</p>
            </div>
            <div className="contacts p-2 flex-1 overflow-y-scroll">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg relative ${selectedUser === conv.id ? 'bg-gray-100' : ''}`}
                  onClick={() => selectUser(conv.id)}
                >
                  <div className="w-16 h-16 relative flex flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src={`https://randomuser.me/api/portraits/men/${conv.id}.jpg`}
                      alt=""
                    />
                  </div>
                  <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                    <p>{conv.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="flex flex-col flex-auto border-l border-gray-300">
            {selectedUser ? (
              <>
                <div className="chat-header px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
                  <div className="flex">
                    <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                      <img
                        className="shadow-md rounded-full w-full h-full object-cover"
                        src={`https://randomuser.me/api/portraits/men/${selectedUser}.jpg`}
                        alt=""
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-bold">{conversations.find(c => c.id === selectedUser)?.name}</p>
                    </div>
                  </div>
                </div>
                <div className="chat-body p-4 flex-1 overflow-y-scroll">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === adminId ? 'justify-end' : 'justify-start'} mb-4`}>
                      <div className={`py-2 px-3 rounded-lg ${message.sender=== adminId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-footer flex-none">
                  <div className="flex flex-row items-center p-4">
                    <div className="relative flex-grow">
                      <input
                        className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-300 focus:border-gray-400 bg-gray-50 focus:bg-white focus:outline-none text-gray-600 focus:shadow-md transition duration-300 ease-in"
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="ml-3 flex flex-shrink-0 focus:outline-none mx-2  text-blue-600 hover:text-blue-700 w-6 h-6"
                    >
                      <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                        <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM6 9a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2H6zm0 2a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2H6z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a conversation to start chatting</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Inbox;

