import { AppShell } from "@/components/layout/app-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { BoardSettings } from "@/components/settings/board-settings";
import { WechatSettings } from "@/components/settings/wechat-settings";
import { AISettings } from "@/components/settings/ai-settings";
import { CriteriaSettings } from "@/components/settings/criteria-settings";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-8 md:px-12">
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-6">
          设置
        </h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 bg-neutral-100 flex-wrap h-auto">
            <TabsTrigger value="profile" className="text-sm">个人资料</TabsTrigger>
            <TabsTrigger value="boards" className="text-sm">板块管理</TabsTrigger>
            <TabsTrigger value="ai" className="text-sm">AI 引擎</TabsTrigger>
            <TabsTrigger value="criteria" className="text-sm">默认标准</TabsTrigger>
            <TabsTrigger value="wechat" className="text-sm">微信推送</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          <TabsContent value="boards">
            <BoardSettings />
          </TabsContent>
          <TabsContent value="ai">
            <AISettings />
          </TabsContent>
          <TabsContent value="criteria">
            <CriteriaSettings />
          </TabsContent>
          <TabsContent value="wechat">
            <WechatSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
