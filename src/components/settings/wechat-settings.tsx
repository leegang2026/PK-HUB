"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function WechatSettings() {
  const [copied, setCopied] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=xxxxxxxx");
  const [enabled, setEnabled] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("已复制到剪贴板");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-900 mb-1">企业微信推送</h2>
        <p className="text-xs text-neutral-500 mb-4">
          配置后，每天早上 8:00 的日报将自动推送到你的企业微信
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${enabled ? "bg-neutral-900" : "bg-neutral-300"}`} onClick={() => setEnabled(!enabled)}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-neutral-700">启用日报推送</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Webhook 地址
            </label>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="粘贴企业微信机器人的 Webhook 地址"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-neutral-50 p-4 text-xs text-neutral-600 space-y-2">
            <p className="font-medium text-neutral-900">配置步骤：</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>打开企业微信，进入目标群聊</li>
              <li>点击右上角「···」→「群机器人」→「添加机器人」</li>
              <li>复制机器人的 Webhook 地址，粘贴到上方输入框</li>
              <li>打开「启用日报推送」开关</li>
            </ol>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("测试消息已发送")}>
            <MessageCircle className="h-3.5 w-3.5 mr-1" />
            发送测试
          </Button>
          <Button size="sm">保存配置</Button>
        </div>
      </div>
    </div>
  );
}
