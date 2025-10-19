import { Card } from "@/components/ui/card";

export default function ForumChannelList({ channels, selectedChannel, onChannelSelect }) {
  return (
    <Card className="p-2 md:p-3 h-fit">
      <div className="flex flex-wrap md:flex-col gap-2 md:gap-1">
        {channels?.map((channel) => (
          <button
            key={channel.name}
            onClick={() => onChannelSelect(channel.name)}
            className={`md:w-full text-left px-3 py-2 rounded-md transition-all flex items-center justify-center md:justify-start gap-2 ${
              selectedChannel === channel.name
                ? 'bg-indigo-600 text-white font-semibold shadow-md'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span className="text-lg">{channel.icon}</span>
            <span className="text-sm hidden md:inline">{channel.displayName}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
