import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Phone, MoreVertical, MapPin, Clock, Users } from 'lucide-react';

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      text: 'Hey! Looking forward to our ride tomorrow',
      time: '10:30 AM',
      isMe: false,
      avatar: 'JD'
    },
    {
      id: 2,
      sender: 'Me',
      text: 'Same here! I\'ll be ready by 8:00 AM sharp',
      time: '10:32 AM',
      isMe: true,
      avatar: 'ME'
    },
    {
      id: 3,
      sender: 'John Doe',
      text: 'Perfect! I\'ll pick you up from the usual spot',
      time: '10:35 AM',
      isMe: false,
      avatar: 'JD'
    },
    {
      id: 4,
      sender: 'Me',
      text: 'Sounds good! Thanks for the ride 😊',
      time: '10:36 AM',
      isMe: true,
      avatar: 'ME'
    },
    {
      id: 5,
      sender: 'John Doe',
      text: 'No problem! See you tomorrow morning',
      time: '10:40 AM',
      isMe: false,
      avatar: 'JD'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Me',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        avatar: 'ME'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-green-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-green-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  JD
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="font-semibold text-gray-800">John Doe</h1>
                <p className="text-sm text-green-600">Online now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
              <Phone className="w-5 h-5 text-green-600" />
            </button>
            <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
        
        {/* Ride Info Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 m-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Downtown → Airport</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Tomorrow, 8:00 AM</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-sm">2/4 seats</span>
              </div>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-sm font-medium transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${msg.isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {!msg.isMe && (
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                  {msg.avatar}
                </div>
              )}
              <div>
                {!msg.isMe && (
                  <p className="text-xs text-gray-500 mb-1 px-3">{msg.sender}</p>
                )}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.isMe
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-green-100'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 px-3 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-green-100 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 text-sm"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${
              message.trim()
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2 mt-3">
          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
            Share Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;