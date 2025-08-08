import React, { useState } from 'react';
import { Search, MoreVertical, MessageCircle, MapPin, Clock, Star } from 'lucide-react';

const MessagesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const conversations = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'JD',
      lastMessage: 'No problem! See you tomorrow morning',
      time: '10:40 AM',
      unreadCount: 0,
      isOnline: true,
      ride: {
        route: 'Downtown → Airport',
        date: 'Tomorrow, 8:00 AM'
      },
      isDriver: true
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      avatar: 'SW',
      lastMessage: 'Thanks for confirming! Looking forward to the trip',
      time: '9:15 AM',
      unreadCount: 2,
      isOnline: true,
      ride: {
        route: 'Mall → University',
        date: 'Today, 2:00 PM'
      },
      isDriver: false
    },
    {
      id: 3,
      name: 'Mike Chen',
      avatar: 'MC',
      lastMessage: 'Perfect timing! I\'ll be there',
      time: 'Yesterday',
      unreadCount: 0,
      isOnline: false,
      ride: {
        route: 'Home → Office Park',
        date: 'Friday, 9:00 AM'
      },
      isDriver: false
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      avatar: 'ER',
      lastMessage: 'Could we leave 15 minutes earlier?',
      time: 'Yesterday',
      unreadCount: 1,
      isOnline: true,
      ride: {
        route: 'Station → City Center',
        date: 'Monday, 7:30 AM'
      },
      isDriver: true
    },
    {
      id: 5,
      name: 'Alex Kumar',
      avatar: 'AK',
      lastMessage: 'Great ride today! Thanks again',
      time: '2 days ago',
      unreadCount: 0,
      isOnline: false,
      ride: {
        route: 'Airport → Downtown',
        date: 'Completed'
      },
      isDriver: false
    },
    {
      id: 6,
      name: 'Lisa Park',
      avatar: 'LP',
      lastMessage: 'Are you still available for the ride?',
      time: '3 days ago',
      unreadCount: 3,
      isOnline: true,
      ride: {
        route: 'Campus → Shopping Mall',
        date: 'Next Week'
      },
      isDriver: true
    }
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (time) => {
    return time;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <p className="text-sm text-green-600">RideBuddy Chats</p>
            </div>
          </div>
          <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-green-600" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-green-50 border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">No conversations found</p>
            <p className="text-sm">Start chatting with your ride buddies!</p>
          </div>
        ) : (
          <div className="divide-y divide-green-100">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white hover:bg-green-50 transition-colors cursor-pointer border-l-4 border-transparent hover:border-green-400"
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {conversation.avatar}
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                      {conversation.isDriver && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
                          <Star className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Conversation Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {conversation.name}
                          {conversation.isDriver && (
                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                              Driver
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.time)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Last Message */}
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {conversation.lastMessage}
                      </p>
                      
                      {/* Ride Info */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{conversation.ride.route}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{conversation.ride.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Stats */}
      <div className="bg-white border-t border-green-100 p-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Active Chats: {conversations.filter(c => c.unreadCount > 0).length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Upcoming Rides: {conversations.filter(c => !c.ride.date.includes('Completed')).length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;