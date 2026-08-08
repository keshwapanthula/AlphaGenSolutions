import mongoose from 'mongoose';

const timesheetEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  projectCode: {
    type: String,
    trim: true,
    maxLength: [50, 'Project code cannot exceed 50 characters']
  },
  taskDescription: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxLength: [500, 'Task description cannot exceed 500 characters']
  },
  hoursWorked: {
    type: Number,
    required: [true, 'Hours worked is required'],
    min: [0, 'Hours cannot be negative'],
    max: [24, 'Hours cannot exceed 24 per day']
  }
}, { _id: false });

const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: [true, 'Week start date is required']
  },
  weekEndDate: {
    type: Date,
    required: [true, 'Week end date is required']
  },
  entries: {
    type: [timesheetEntrySchema],
    validate: {
      validator: (v) => v.length > 0,
      message: 'Timesheet must have at least one entry'
    }
  },
  totalHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },
  employeeNotes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  },
  supervisorNotes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Supervisor notes cannot exceed 1000 characters']
  },
  submittedAt: {
    type: Date
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Auto-calculate totalHours before saving
timesheetSchema.pre('save', function (next) {
  this.totalHours = this.entries.reduce((sum, e) => sum + e.hoursWorked, 0);
  next();
});

// One timesheet per employee per week
timesheetSchema.index({ employeeId: 1, weekStartDate: 1 }, { unique: true });
timesheetSchema.index({ supervisorId: 1, status: 1 });
timesheetSchema.index({ status: 1 });

const Timesheet = mongoose.model('Timesheet', timesheetSchema);

export default Timesheet;
