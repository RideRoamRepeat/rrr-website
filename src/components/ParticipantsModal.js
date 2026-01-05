import React from 'react';

export default function ParticipantsModal({ isOpen, onClose, participants }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trip Participants</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Participants List */}
        <div className="max-h-96 overflow-y-auto">
          {participants.length > 0 ? (
            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {participant.userImage ? (
                      <img
                        src={participant.userImage}
                        alt={participant.fullName}
                        className="h-12 w-12 rounded-full object-cover border border-white/10"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/80 to-sky-400/80 border border-white/10">
                        <span className="text-sm font-medium text-white">
                          {participant.fullName?.charAt(0)?.toUpperCase() || 'R'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{participant.fullName}</div>
                    <div className="text-sm text-white/60">
                      {participant.riderName && `@${participant.riderName}`}
                    </div>
                    {participant.bikeBrandModel && (
                      <div className="text-xs text-white/40 mt-1">
                        🏍️ {participant.bikeBrandModel}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="flex-shrink-0 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition">
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <svg className="h-8 w-8 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Participants Yet</h3>
              <p className="text-sm text-white/60">Be the first to join this amazing ride!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {participants.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="text-center text-sm text-white/60">
              {participants.length} rider{participants.length !== 1 ? 's' : ''} registered
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
