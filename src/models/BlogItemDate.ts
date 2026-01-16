import moment from "moment";

export class BlogItemDate {
    public readonly weekday: string;
    public readonly day: string;
    public readonly month: string;
    public readonly year: string;

    constructor(createdDate: string) {
     const parsedDate = moment(createdDate);
     this.weekday = parsedDate.format("dddd");
     this.day = parsedDate.format("D");
     this.month = parsedDate.format("MMMM");
     this.year = parsedDate.format("Y") ;
    }
  }
