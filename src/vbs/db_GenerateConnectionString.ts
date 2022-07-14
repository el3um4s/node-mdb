export const db_GenerateConnectionString = `
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

   ' GenerateConnectionString = Replace("Provider=Microsoft.ACE.OLEDB.12.0;Data Source='NAMEDATABASE';Persist Security Info=False;","NAMEDATABASE",nameDatabase)

End Function

Function DatabaseExstension(nameDatabase)
    dim ext
    ext = "NONE"
    If Right(UCase(nameDatabase), 4) = ".MDB" then
        ext = "MDB"
    End If
    If Right(UCase(nameDatabase), 6) = ".ACCDB" then
        ext = "ACCDB"
    End If
    DatabaseExstension = ext
End Function`;
