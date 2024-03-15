'use server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import mongoose from 'mongoose';
import UsernameForm from "../../component/forms/UsernameForm";
import { Page } from "@/models/Page";
import PageSettingsForm from "@/app/component/forms/PageSettingsForm";
import PageButtonsForm from "@/app/component/forms/PageButtonsForm";
import PageLinksForm from "@/app/component/forms/PageLinksForm";
import cloneDeep from "clone-deep";


export default async function AccountPage({ searchParams}) {
    const session = await getServerSession(authOptions); 
    const desiredUsername = searchParams.desiredUsername;
    if (!session)
    {
        redirect('/');
    }
    mongoose.connect(process.env.MONGO_URI)
    const page = await Page.findOne({ owner: session?.user?.email });
    const leanPage = cloneDeep(page.toJSON());
    if (page)
    {
        return (
            <>
            <PageSettingsForm page={leanPage} user={session.user} />
            <PageButtonsForm page={leanPage} user={session.user} />
            <PageLinksForm page={leanPage} user={session.user} />    
            </> 
        );
    }

    return (
        <div>
            <UsernameForm desiredUsername={ desiredUsername} />
        </div>

    );
}