"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, RefreshCw, Check, Key, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetActiveKey,
  useUpdateRoleKey,
  useUploadKey,
  usGetRoles,
} from "@/queries/keyGenerator.queries";
import { toast } from "sonner";

const RoleKeyGenerator = () => {
  const [currentKey, setCurrentKey] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [keyBorderColor, setKeyBorderColor] = useState("gray");
  const [selectedRole, setSelectedRole] = useState(undefined);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // get active key query
  const GetActiveKeyQuery = useGetActiveKey();
  // get roles query
  const GetRolesQuery = usGetRoles();
  // generate submit key query
  const SubmitKeyQuery = useUploadKey();

  useEffect(() => {
    if (GetActiveKeyQuery.isSuccess) {
      if (GetActiveKeyQuery.data.length > 0) {
        console.log(GetActiveKeyQuery.data[0].role_key);
        setCurrentKey(GetActiveKeyQuery.data[0].role_key);
        setKeyBorderColor("green");
      } else {
        setCurrentKey("No active key");
        setKeyBorderColor("red");
      }
      console.log(GetActiveKeyQuery.data);
    }
  }, [GetActiveKeyQuery.isSuccess]);

  // Generate a UUID v4
  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    // if there is an active key no need to generate
    // when the user generates a key we set is generated to true to avoid the generation of another active key
    if (
      (GetActiveKeyQuery.data && GetActiveKeyQuery.data.length > 0) ||
      isGenerated
    ) {
      toast.error("An active key already exists");
      setIsGenerating(false);
      return;
    }

    // return if no role was selected
    if (!selectedRole) {
      toast.error("Select role");
      setIsGenerating(false);
      return;
    }
    // just an extra check
    if (GetActiveKeyQuery.data && GetActiveKeyQuery.data.length <= 0) {
      const key = generateUUID();
      // submit key
      // set status to active here
      const promise = SubmitKeyQuery.mutateAsync({
        role_type_id: selectedRole,
        role_key: key,
        status: "active",
      });

      toast.promise(promise, {
        loading: "Generating key...",
        success: "Key Generated Successfully",
        error: "There was an error while trying to generate key",
      });

      const result = await promise;
      // set key state and other states
      setCurrentKey(result.role_key);
      setIsGenerated(true);
      setKeyBorderColor("green");
      setIsGenerating(false);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(currentKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md"></div>
          <div className="relative bg-primary rounded-full p-3">
            <Key className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">Role Key Generator</h1>
          <p className="text-muted-foreground mt-1">
            Generate registration keys for new users
          </p>
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Only IT (Super Admin) can generate role keys. Share these keys
          securely with new users for account registration.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Current Role Key</CardTitle>
          <CardDescription>
            This key can be used once for user registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Active Role Key</Label>
            <div className="flex gap-2">
              <Input
                value={currentKey}
                readOnly
                className={`font-mono text-sm border-${keyBorderColor}-300 focus-visible:ring-${keyBorderColor}-300 focus-visible:border-${keyBorderColor}-300`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyKey}
                disabled={copied}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-green-600">Copied to clipboard!</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Assign Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {GetRolesQuery.data &&
                  GetRolesQuery.data.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">
              Please read the roles rules before assigning roles
            </p>
            <p className="text-xs text-muted-foreground">
              The generated key will allow registration with this role
            </p>
          </div>

          <Button
            onClick={handleGenerateKey}
            disabled={isGenerating || !GetActiveKeyQuery.data}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New Key
              </>
            )}
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button disabled={isGenerating} className="w-full opacity-30">
                Share New Key{" "}
                <span>
                  <Badge variant={"secondary"} className="text-xs">
                    Coming soon
                  </Badge>
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sharing Links seamlessly through mails is coming soon</p>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles Explained</CardTitle>
          <CardDescription>
            Please read this before assigning roles to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>
              <span className="text-primary">IT:</span> The user with the IT
              role can generate keys for staffs to sign in to the application,
              adn can also Create delete and update information accross the
              application{" "}
              <span className="text-red-500">
                The IT admin is the super admin
              </span>{" "}
            </li>
            <li>
              <span className="text-primary">Admin:</span> The user with the
              Admin role can create, update and delete Vehicle data across the
              application
            </li>
            <li>
              <span className="text-primary">Staff:</span>
              The user with the Staff role can create and update Vehicle data
              but is restricted to deleting data
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to use the Key Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li>Select the role you want to assign to the new user</li>
            <li>
              Click "Generate New Key" to create a unique registration key
            </li>
            <li>Copy the key and share it securely with the new user</li>
            <li>The user will enter this key during registration</li>
            <li>Each key can only be used once for security purposes</li>
          </ol>
        </CardContent>
      </Card>

      {/* removed recently generated keys for now */}

      {/* <Card>
        <CardHeader>
          <CardTitle>Recent Generated Keys</CardTitle>
          <CardDescription>Last 5 generated keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                key: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                role: "Admin",
                date: "2025-10-12",
                used: false,
              },
              {
                key: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
                role: "Manager",
                date: "2025-10-11",
                used: true,
              },
              {
                key: "c3d4e5f6-a7b8-9012-cdef-123456789012",
                role: "Staff",
                date: "2025-10-10",
                used: true,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-mono text-sm">{item.key}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.role} • {item.date}
                  </p>
                </div>
                <div className="ml-4">
                  {item.used ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      Used
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600">
                      Active
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default RoleKeyGenerator;
