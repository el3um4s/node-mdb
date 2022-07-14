export const db_OpenConnection = `
Function OpenConnection(sConnectionString)
    Set objConnection = CreateObject("ADODB.Connection")
    OpenConnection = objConnection.Open(sConnectionString)
End Function`;
