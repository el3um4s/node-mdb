export const databaseExtension = `
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
