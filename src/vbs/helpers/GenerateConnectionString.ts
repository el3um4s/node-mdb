import { databaseExtension } from "./DatabaseExtension";

export const generateConnectionString = `
${databaseExtension}

Function GenerateConnectionString(nameDatabase)
    GenerateConnectionString = "NONE"
    Dim ext
    ext = DatabaseExstension(nameDatabase)
    
    If ext = "MDB" then
        GenerateConnectionString = Replace("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='NAMEDATABASE';","NAMEDATABASE",nameDatabase) 
    End If

    If ext = "ACCDB" then
        GenerateConnectionString = Replace("Provider=Microsoft.ACE.OLEDB.12.0;Data Source='NAMEDATABASE';Persist Security Info=False;","NAMEDATABASE",nameDatabase)
    End If

End Function`;
