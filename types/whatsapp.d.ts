import "whatsapp-web.js";

declare module "whatsapp-web.js" {
  interface GroupChat {
    pastParticipants: {
      id: { user: string };
      leaveTimestamp: number;
      leaveReason?: string;
    }[];
    groupMetadata: {
      id: {
        server: string;
        user: string;
        _serialized: string;
      };
      creation: number;
      owner: {
        server: string;
        user: string;
        _serialized: string;
      };
      subject: string;
      subjectTime: number;
      desc: string;
      descId: string;
      descTime: number;
      descOwner: {
        server: string;
        user: string;
        _serialized: string;
      };
      restrict: boolean;
      announce: boolean;
      noFrequentlyForwarded: boolean;
      ephemeralDuration: number;
      membershipApprovalMode: boolean;
      memberAddMode: string;
      memberLinkMode: string;
      reportToAdminMode: boolean;
      size: number;
      support: boolean;
      suspended: boolean;
      terminated: boolean;
      uniqueShortNameMap: any;
      isLidAddressingMode: boolean;
      isParentGroup: boolean;
      isParentGroupClosed: boolean;
      defaultSubgroup: boolean;
      generalSubgroup: boolean;
      hiddenSubgroup: boolean;
      groupSafetyCheck: boolean;
      groupAdder: {
        server: string;
        user: string;
        _serialized: string;
      };
      generalChatAutoAddDisabled: boolean;
      allowNonAdminSubGroupCreation: boolean;
      lastActivityTimestamp: number;
      lastSeenActivityTimestamp: number;
      hasCapi: boolean;
      participants: {
        id: {
          server: string;
          user: string;
          _serialized: string;
        };
        isAdmin: boolean;
        isSuperAdmin: boolean;
      }[];
      pendingParticipants: any[];
      pastParticipants: any[];
      membershipApprovalRequests: any[];
      subgroupSuggestions: any[];
    };
  }
  interface Message {
    _data: {
      id: {
        fromMe: boolean;
      };
      notifyName: string;
      isViewOnce: boolean;
    };
  }
}
