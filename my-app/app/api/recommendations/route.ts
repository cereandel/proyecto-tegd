import {NextRequest, NextResponse} from "next/server";
import {processRecommendations} from '@/app/lib/mongodb'

export async function GET(request: Request) {
    try{
        const a = await processRecommendations();
        if(a){
            console.log('this is a', a)
            return NextResponse.json({ result: a }, { status: 200 });
        }
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    catch(err){
        console.error('Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


