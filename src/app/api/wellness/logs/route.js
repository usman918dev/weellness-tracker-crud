import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import WellnessLog from '@/models/WellnessLog';

// Helper function to validate date range
const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end && !isNaN(start) && !isNaN(end);
};

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { type, value, details } = data;

    if (!type || !value) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const log = await WellnessLog.create({
      user: session.user.id,
      type,
      value,
      details,
      date: new Date(),
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error('Create wellness log error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    await connectDB();

    const query = { user: session.user.id };

    if (type) {
      query.type = type;
    }

    if (startDate && endDate && validateDateRange(startDate, endDate)) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const logs = await WellnessLog.find(query)
      .sort({ date: -1 })
      .limit(100);

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Get wellness logs error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, type, value, details } = data;

    if (!id || !type || !value) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const log = await WellnessLog.findOneAndUpdate(
      { _id: id, user: session.user.id },
      { type, value, details },
      { new: true }
    );

    if (!log) {
      return NextResponse.json(
        { message: 'Log not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error('Update wellness log error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Missing log ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const log = await WellnessLog.findOneAndDelete({
      _id: id,
      user: session.user.id
    });

    if (!log) {
      return NextResponse.json(
        { message: 'Log not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Delete wellness log error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
