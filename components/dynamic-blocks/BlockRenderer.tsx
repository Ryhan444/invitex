"use client";

import React from "react";
import { EventSection, GuestWish } from "@/types";
import { BannerBlock } from "./BannerBlock";
import { StoryBlock } from "./StoryBlock";
import { ScheduleBlock } from "./ScheduleBlock";
import { GalleryBlock } from "./GalleryBlock";
import { DonationBlock } from "./DonationBlock";
import { GuestbookBlock } from "./GuestbookBlock";

interface BlockRendererProps {
  sections: EventSection[];
  eventId: string;
  eventDate?: string;
  initialWishes?: GuestWish[];
  onOpenInvitation?: () => void;
}

export function BlockRenderer({
  sections,
  eventId,
  eventDate,
  initialWishes,
  onOpenInvitation,
}: BlockRendererProps) {
  // Sort sections by order_index
  const visibleSections = [...sections]
    .filter((sec) => sec.is_visible !== false)
    .sort((a, b) => a.order_index - b.order_index);

  const bannerSection = visibleSections.find((s) => s.type === "banner");
  const contentSections = visibleSections.filter((s) => s.type !== "banner");

  return (
    <div className="w-full">
      {/* 1. Hero Banner */}
      {bannerSection && (
        <BannerBlock
          key={bannerSection.id || "banner"}
          content={bannerSection.content}
          onOpenInvitation={onOpenInvitation}
          targetDate={eventDate}
        />
      )}

      {/* Target anchor for 'Open Invitation (Play)' smooth scroll */}
      <div id="invitation-content" className="scroll-mt-14" />

      {/* 2. Content Sections */}
      {contentSections.map((section, index) => {
        switch (section.type) {
          case "story":
            return <StoryBlock key={section.id || index} content={section.content} />;
          case "schedule":
            return (
              <ScheduleBlock
                key={section.id || index}
                content={section.content}
                eventDate={eventDate}
              />
            );
          case "gallery":
            return <GalleryBlock key={section.id || index} content={section.content} />;
          case "donation":
            return <DonationBlock key={section.id || index} content={section.content} />;
          case "guestbook":
            return (
              <GuestbookBlock
                key={section.id || index}
                content={section.content}
                eventId={eventId}
                initialWishes={initialWishes}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
