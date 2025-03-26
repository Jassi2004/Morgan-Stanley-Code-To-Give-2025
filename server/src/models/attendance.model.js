import mongoose, { Schema } from "mongoose";


const attendanceSchema = new Schema({
    studentId : {
        type : Schema.Types.ObjectId,
        ref : "Student"
    },
    educatorId : {
        type : Schema.Types.ObjectId,
        ref : "Employee"
    },
    report : [
        {
            month : {
                type : String,
                enum : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            status : [
                {
                    type : "String",
                    enum : ["P", "A", "$"],
                    default : "$"
                }
            ]
        }
    ],
    attendancePercentage : {
        type : Number,
        default : 0,
        min : [0, "Percentage can't be less than 0"],
        max : [100, "Percentage can't be greater than 100"]
    },
},{
    timestamps : true
})
// in the report section this would be an array of objects where each object would depict the month and an another array of strings where the attendance would be marked acc to the day ( 0 - based indexing)

function calculateAttendancePercentage(report){
    let totalDays = 0;
    let presentDays = 0;

    report.forEach((ele) => {
        ele.status.forEach((day) => {
            if(day !== "$") totalDays++;
            if(day === "P") presentDays++;
        });
    });

    return totalDays > 0 ? ( presentDays / totalDays ) * 100 : 0;
}

attendanceSchema.post("save", async function( next){
    this.attendancePercentage = calculateAttendancePercentage(this.report);
})


export const attendance = mongoose.model("Attendance", attendanceSchema);


