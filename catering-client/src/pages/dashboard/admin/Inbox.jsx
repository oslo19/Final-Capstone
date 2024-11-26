import React, { useState } from 'react';

const Inbox = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Okay rako?', sender: 'other' },
    { text: 'Nga okay raka?', sender: 'self' },
  ]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { text: inputMessage, sender: 'self' }]);
      setInputMessage('');
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  return (
    <div className="h-screen w-full flex antialiased text-gray-800 bg-white overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-grow flex flex-row min-h-0">
          {/* Left Sidebar */}
          <section className="flex flex-col flex-none overflow-auto w-24 group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out">
            <div className="header p-4 flex flex-row justify-center flex-none">
              <p className="text-md font-bold hidden md:block group-hover:block">Inbox</p>
            </div>
          </section>

          {/* Right Chat Area */}
          <section className="flex flex-col flex-auto border-l border-gray-300">
            {/* Chat Header */}
            <div className="chat-header px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
              <div className="flex">
                <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
                  <img
                    className="shadow-md rounded-full w-full h-full object-cover"
                    src="https://img-s1.onedio.com/id-636fbd5fa99378ac2941e5cf/rev-0/w-600/h-600/f-jpg/s-8f6b0c51641bfe96893ea3ded522a020e4a0753b.jpg"
                    alt="Chat User"
                  />
                </div>
                <div className="text-sm">
                  <p className="font-bold">Johnny Sins</p>
                  <p className="text-gray-600">Active 1h ago</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="chat-body p-4 flex-1 overflow-y-scroll">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-row ${
                    message.sender === 'self' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className={`messages text-sm ${message.sender === 'self' ? 'text-white' : 'text-gray-800'} grid grid-flow-row gap-2`}>
                    <div
                      className={`px-6 py-3 rounded-lg ${
                        message.sender === 'self' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                      } max-w-xs lg:max-w-md`}
                    >
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Footer */}
            <div className="chat-footer flex-none">
              <div className="flex flex-row items-center p-4">
                <div className="relative flex-grow">
                  <input
                    className="input-message rounded-full py-2 pl-3 pr-10 w-full border border-gray-300 focus:border-gray-500 bg-gray-100 focus:bg-white focus:outline-none text-gray-800 focus:shadow-md transition duration-300 ease-in"
                    type="text"
                    value={inputMessage}
                    placeholder="Aa"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className="flex flex-shrink-0 focus:outline-none mx-2 text-blue-600 hover:text-blue-700 w-6 h-6"
                >
                  <svg viewBox="0 0 20 20" className="w-full h-full fill-current">
                    <path d="M11.0010436,0 C9.89589787,0 9.00000024,0.886706352 9.0000002,1.99810135 L9,8 L1.9973917,8 C0.894262725,8 0,8.88772964 0,10 L0,12 L2.29663334,18.1243554 C2.68509206,19.1602453 3.90195042,20 5.00853025,20 L12.9914698,20 C14.1007504,20 15,19.1125667 15,18.000385 L15,10 L12,3 L12,0 L11.0010436,0 L11.0010436,0 Z M17,10 L20,10 L20,20 L17,20 L17,10 L17,10 Z" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Inbox;
