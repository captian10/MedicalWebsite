import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Globe, Bell, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Admin settings and configuration",
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your academy configuration
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-medical-600" />
              General
            </CardTitle>
            <CardDescription>
              Site name, description, and branding
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              General settings will be available in a future update. Your site is
              currently configured via environment variables.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="h-5 w-5 text-medical-600" />
              Notifications
            </CardTitle>
            <CardDescription>
              Email and push notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Notification settings are coming soon. Stay tuned for email
              alerts on new announcements and lectures.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-medical-600" />
              Security
            </CardTitle>
            <CardDescription>
              Authentication and access control
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Security settings are managed through your Supabase dashboard.
              Visit your project&apos;s authentication settings to configure
              sign-in providers and policies.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5 text-medical-600" />
              Advanced
            </CardTitle>
            <CardDescription>
              Database, storage, and API configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced configuration is handled via environment variables and
              the Supabase dashboard. Contact the development team for changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
