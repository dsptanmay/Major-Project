import React from "react";
import {useActiveAccount} from "thirdweb/react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Wallet} from "lucide-react";

export default function OrgNotificationsPage(){
    const activeAccount = useActiveAccount();

    if(!activeAccount){
        return <div>
            <Alert className="bg-red-300">
                <Wallet className="h-4 w-4"/>
                <AlertTitle>Missing Crypto Wallet</AlertTitle>
                <AlertDescription>Please connect your wallet first!</AlertDescription>
            </Alert>
        </div>
    }
    return <div
        className="flex w-full flex-col items-center justify-between max-w-6xl bg-white border-border shadow-light p-10">
        <h2>
            Notifications for{" "}
            <span>
          <code>{`${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)}`}</code>
        </span>{" "}
            :
        </h2>
    </div>
}