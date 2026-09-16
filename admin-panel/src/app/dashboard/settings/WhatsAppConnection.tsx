"use client";

import { useState, useEffect } from"react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { SmartPhone01Icon, QrCodeIcon, Tick01Icon, AlertCircleIcon, Refresh01Icon, Plug01Icon } from "hugeicons-react";
import { QRCodeSVG } from 'qrcode.react';

export function WhatsAppConnection({ session }: { session: any }) {
  const [status, setStatus] = useState<string>("LOADING");
  const [qrCode, setQrCode] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Poll backend for real connection status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/whatsapp/status');
        if (res.ok) {
          const data = await res.json();
          setStatus(data.status); // CONNECTED, DISCONNECTED, QR, LOGGED_OUT
          setQrCode(data.qr);
          setPhone(data.phone);
        } else {
          setStatus("ERROR");
        }
      } catch (err) {
        setStatus("ERROR");
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Poll every 3s
    return () => clearInterval(interval);
  }, []);

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await fetch('http://localhost:3001/api/whatsapp/logout', { method: 'POST' });
      // The polling will automatically update UI to DISCONNECTED or QR
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <Card className="border-zinc-800 bg-[#0c0c0e]">
      <CardHeader className="border-b border-zinc-800/50">
        <CardTitle className="text-lg text-zinc-100 flex items-center gap-2">
          <SmartPhone01Icon className="w-5 h-5 text-indigo-400" /> WhatsApp Integration (Live)
        </CardTitle>
        <CardDescription className="text-zinc-400">
          Connect your organization's WhatsApp number using the real Baileys backend.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Status Panel */}
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-sm font-medium text-zinc-400 mb-2">Connection Status</p>
              {status ==="CONNECTED" ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Tick01Icon className="w-4 h-4" /> Connected
                </div>
              ) : status ==="ERROR" ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
                  <AlertCircleIcon className="w-4 h-4" /> Backend Offline
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-400">
                  <Refresh01Icon className="w-4 h-4 animate-spin" /> {status === 'QR' ? 'Waiting for Scan...' : 'Initializing...'}
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-zinc-400 mb-2">Connected Number</p>
              <p className="text-lg font-mono text-zinc-200">
                {status ==="CONNECTED" && phone ? `+${phone}` :"Not configured"}
              </p>
            </div>
          </div>

          {/* Action Panel */}
          <div className="w-full md:w-[320px] shrink-0 bg-[#09090b] border border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center h-fit">
            {status ==="CONNECTED" ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <SmartPhone01Icon className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-zinc-200 font-medium">WhatsApp is Active</h3>
                <p className="text-zinc-500 text-sm mb-4">Your AI bot is currently receiving and replying to messages.</p>
                <Button 
                  onClick={handleDisconnect} 
                  disabled={isDisconnecting}
                  variant="outline" 
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                >
                  <Plug01Icon className="w-4 h-4 mr-2" /> Disconnect Bot
                </Button>
              </div>
            ) : status ==="QR" && qrCode ? (
              <div className="text-center space-y-4 w-full">
                <div className="bg-white p-4 rounded-xl mx-auto inline-block border-4 border-zinc-800 mb-2">
                  <QRCodeSVG value={qrCode} size={200} />
                </div>
                <h3 className="text-zinc-200 font-medium">Scan QR Code</h3>
                <p className="text-zinc-500 text-sm mb-2">Open WhatsApp on your phone (Linked Devices) and scan this code.</p>
              </div>
            ) : status ==="ERROR" ? (
               <div className="text-center space-y-4 w-full">
                  <AlertCircleIcon className="w-10 h-10 text-red-500 mx-auto" />
                  <p className="text-zinc-400 text-sm">Cannot reach backend server at port 3000.</p>
               </div>
            ) : (
              <div className="text-center space-y-4 w-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-2 animate-pulse shadow-inner">
                  <QrCodeIcon className="w-8 h-8 text-zinc-700" />
                </div>
                <h3 className="text-zinc-200 font-medium">Getting Ready</h3>
                <p className="text-zinc-500 text-sm">Generating secure QR code...</p>
              </div>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}
