pragma solidity >=0.4.22 <0.9.0;

contract Pelaporan {
    enum Status {
        Pending,
        Investigating,
        Confirmed,
        NotConfirmed
    }

    struct Laporan {
        uint id;
        string usernameSocialMedia;
        string email;
        string nomorHp;
        string nik;
        string buktiMedia;
        Status status;
        address pelapor;
    }

    struct User {
        string nik;
        bytes32 passwordHash;
        bool isAdmin;
    }

    mapping(uint => Laporan) public laporanKasus;
    mapping(address => User) public users;
    uint public jumlahLaporan;
    mapping(string => uint[]) private laporanIndex;

    address public admin;

    event LaporanDibuat(uint id, address pelapor);
    event StatusDiperbarui(uint id, Status status);
    event UserTerdaftar(address userAddress, string nik);

    constructor() {
        admin = msg.sender;
    }

    function register(string memory _nik, string memory _password) public {
        require(
            bytes(users[msg.sender].nik).length == 0,
            "Pengguna sudah terdaftar"
        );

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        users[msg.sender] = User({
            nik: _nik,
            passwordHash: passwordHash,
            isAdmin: false
        });

        emit UserTerdaftar(msg.sender, _nik);
    }

    function login(
        string memory _nik,
        string memory _password
    ) public view returns (bool) {
        require(
            bytes(users[msg.sender].nik).length != 0,
            "Pengguna tidak terdaftar"
        );

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        require(
            keccak256(abi.encodePacked(users[msg.sender].nik)) ==
                keccak256(abi.encodePacked(_nik)),
            "NIK tidak cocok"
        );

        require(
            users[msg.sender].passwordHash == passwordHash,
            "Kata sandi salah"
        );

        return true;
    }

    function laporKasus(
        string memory _usernameSocialMedia,
        string memory _email,
        string memory _nomorHp,
        string memory _nik,
        string memory _buktiMedia
    ) public {
        laporanKasus[jumlahLaporan] = Laporan({
            id: jumlahLaporan,
            usernameSocialMedia: _usernameSocialMedia,
            email: _email,
            nomorHp: _nomorHp,
            nik: _nik,
            buktiMedia: _buktiMedia,
            status: Status.Pending,
            pelapor: msg.sender
        });

        laporanIndex[_usernameSocialMedia].push(jumlahLaporan);
        laporanIndex[_email].push(jumlahLaporan);
        laporanIndex[_nomorHp].push(jumlahLaporan);
        laporanIndex[_nik].push(jumlahLaporan);

        jumlahLaporan++;
    }

    function updateStatus(uint _id, Status _status) public {
        require(msg.sender == admin, "Hanya admin yang bisa mengubah status");
        require(_id < jumlahLaporan, "ID laporan tidak valid");

        laporanKasus[_id].status = _status;
        emit StatusDiperbarui(_id, _status);
    }

    function cariSemuaKasus(
        string memory _query
    ) public view returns (Laporan[] memory) {
        uint[] memory indices = laporanIndex[_query];
        Laporan[] memory hasil = new Laporan[](indices.length);

        for (uint i = 0; i < indices.length; i++) {
            hasil[i] = laporanKasus[indices[i]];
        }

        return hasil;
    }
}
