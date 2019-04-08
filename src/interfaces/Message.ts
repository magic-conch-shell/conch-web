export interface IPNMessage {
  actualChannel: string | null;
  channel: string;
  message: {
    [index: string]: any;
  };
  publisher: string;
  subscribedChannel: string;
  timetoken: string;
};