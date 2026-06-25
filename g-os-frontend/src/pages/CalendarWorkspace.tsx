import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Sparkles, CheckSquare, MessageSquare, Play, Video, Mic, RefreshCw, Square } from 'lucide-react';

interface MockMeeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'recording' | 'processed';
  mom?: string;
  actionItems?: string[];
}

export const CalendarWorkspace: React.FC = () => {
  const [meetings, setMeetings] = useState<MockMeeting[]>([
    {
      id: '1',
      title: 'Project Alpha Sync',
      time: '10:00 AM - 10:30 AM',
      duration: '30m',
      status: 'processed',
      mom: 'Reviewed API structures and initialized code integration layers. The workflow setup requires OAuth sync settings update.',
      actionItems: ['Setup OAuth settings in integrations tab', 'Draft directory folder structures', 'Establish route guards']
    },
    {
      id: '2',
      title: 'Sprint Planning',
      time: '02:00 PM - 03:00 PM',
      duration: '1h',
      status: 'upcoming',
      mom: '',
      actionItems: []
    }
  ]);
  const [selectedMeeting, setSelectedMeeting] = useState<MockMeeting>(meetings[0]);

  // Live recording simulation states
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptLines, setTranscriptLines] = useState<string[]>([]);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
        // Simulate transcripts incoming
        const simulatedDialogs = [
          "[Ankit Sharma]: We need to migrate index.css to tailwind directives first.",
          "[Kavya Chopra]: Understood. Let's make sure the custom colors match our design values.",
          "[Rahul Sharma]: I will update tsconfig options to solve css declarations.",
          "[Ankit Sharma]: Perfect, let's target that for the morning review sync."
        ];
        const lineIdx = Math.floor(secondsElapsed / 5) % simulatedDialogs.length;
        if (secondsElapsed % 5 === 0 && transcriptLines.length < simulatedDialogs.length) {
          const newLine = simulatedDialogs[lineIdx];
          if (newLine && !transcriptLines.includes(newLine)) {
            setTranscriptLines(prev => [...prev, newLine]);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, secondsElapsed, transcriptLines]);

  const startMeetingSimulation = () => {
    setIsRecording(true);
    setTranscriptLines(["[System]: Audio streaming channel synchronized. Commencing live transcription..."]);
    setSecondsElapsed(0);
    
    // Change meeting status to recording
    setMeetings(prev => prev.map(m => m.id === selectedMeeting.id ? { ...m, status: 'recording' } : m));
    setSelectedMeeting(prev => ({ ...prev, status: 'recording' }));
  };

  const stopMeetingSimulation = () => {
    setIsRecording(false);
    
    const finalMom = "Successfully established Tailwind directives, resolved CSS side-effect import types in tsconfig, and prepared high-fidelity layouts.";
    const finalActions = [
      "Review UI templates for Mail and Calendar",
      "Validate TS type definitions on GlobalLayout shell"
    ];

    setMeetings(prev => prev.map(m => m.id === selectedMeeting.id ? { 
      ...m, 
      status: 'processed', 
      mom: finalMom, 
      actionItems: finalActions 
    } : m));

    setSelectedMeeting(prev => ({ 
      ...prev, 
      status: 'processed', 
      mom: finalMom, 
      actionItems: finalActions 
    }));
  };

  const handleCheckboxChange = (index: number) => {
    if (!selectedMeeting.actionItems) return;
    // Checkbox toggles just logs to keep it light
    console.log(`Action item checked state toggled: ${selectedMeeting.actionItems[index]}`);
  };

  return (
    <div className="h-full flex flex-col font-sans">
      <div className="p-6 border-b border-slate-800/60 flex items-center justify-between bg-[#0c0d14]">
        <div>
          <h2 className="text-xl font-bold text-white m-0 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Calendar & Meeting MoM</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">AI Meeting Minutes Pipeline & Calendar Schedule Integration.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Meetings List */}
        <div className="w-[35%] border-r border-slate-800/60 overflow-y-auto bg-[#0a0b10]">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => {
                setSelectedMeeting(meeting);
                setIsRecording(false);
                setTranscriptLines([]);
              }}
              className={`p-4 border-b border-slate-800/40 cursor-pointer transition-all hover:bg-slate-900/40 relative ${
                selectedMeeting?.id === meeting.id ? 'bg-indigo-600/10 border-l-2 border-l-indigo-500' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-300">{meeting.title}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  meeting.status === 'processed' ? 'bg-emerald-500/10 text-emerald-400' :
                  meeting.status === 'recording' ? 'bg-rose-500/15 text-rose-400 animate-pulse' :
                  'bg-indigo-500/10 text-indigo-400'
                }`}>
                  {meeting.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{meeting.time} ({meeting.duration})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Meeting Detail & MoM Pipeline */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0c0d14] space-y-6">
          {selectedMeeting ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/40 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedMeeting.title}</h3>
                  <span className="text-xs text-slate-400 mt-1 block">{selectedMeeting.time}</span>
                </div>
                
                {selectedMeeting.status === 'upcoming' && (
                  <button 
                    onClick={startMeetingSimulation}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Transcription Sync</span>
                  </button>
                )}

                {selectedMeeting.status === 'recording' && (
                  <button 
                    onClick={stopMeetingSimulation}
                    className="flex items-center space-x-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop & Generate MoM</span>
                  </button>
                )}
              </div>

              {/* LIVE TRANSCRIPTION STREAM */}
              {selectedMeeting.status === 'recording' && (
                <div className="bg-slate-950/80 border border-slate-800/60 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                      <span className="text-xs font-semibold text-white">Live transcription actively listening</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Duration: {secondsElapsed}s</span>
                  </div>

                  <div className="space-y-2 h-44 overflow-y-auto font-mono text-[11px] text-slate-400 border-t border-slate-900 pt-3">
                    {transcriptLines.map((line, idx) => (
                      <p key={idx} className="leading-relaxed m-0">{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {selectedMeeting.status === 'processed' && (
                <div className="space-y-6">
                  {/* AI MoM Summary */}
                  <div className="bg-[#101220] border border-slate-800/60 p-5 rounded-2xl space-y-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-semibold text-white">AI Generated Minutes of Meeting (MoM)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-850">
                      {selectedMeeting.mom}
                    </p>
                  </div>

                  {/* Action Items */}
                  <div className="bg-[#101220] border border-slate-800/60 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-white">Action Items Pipeline</span>
                    </div>
                    <div className="space-y-2">
                      {selectedMeeting.actionItems?.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 p-3 bg-[#141624]/40 border border-slate-800/40 rounded-xl hover:bg-[#1b1e32]/40 transition-colors">
                          <input 
                            type="checkbox" 
                            onChange={() => handleCheckboxChange(idx)}
                            className="rounded border-slate-800 bg-[#0c0d14] text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer" 
                          />
                          <span className="text-xs text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedMeeting.status === 'upcoming' && (
                <div className="bg-[#101220] border border-slate-800/60 p-8 rounded-2xl text-center space-y-3">
                  <Clock className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-xs font-semibold text-white">Audio Sync Stream Offline</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Transcription stream will analyze dialogue signals and auto-generate summaries when the meeting starts.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Select a calendar sync node to configure pipelines
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CalendarWorkspace;
